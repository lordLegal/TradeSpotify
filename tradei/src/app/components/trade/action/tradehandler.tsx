"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";


export async function buyHandler(data: any) {
    const prisma = new PrismaClient();
    const artist_spotify_id = data?.get("artist_id");
    const coins = parseInt(data?.get("coins"));
    const user_id = (data?.get("user_id"));

    if (artist_spotify_id !== null && coins !== null && user_id !== null && !isNaN(coins)) {
        console.log(" Buy all data is there");

        const artist = await prisma.artist.findFirst({
            where: {
                spotify_id: artist_spotify_id
            }
        })

        if (artist === null) {
            console.log("artist not found");
            return;
        }

        const artist_id = artist?.id;


        // create invest artist

        const investArtist = await prisma.investArtist.findMany({
            where: {
                artistId: artist_id,
                userId: user_id
            }
        })

        if (investArtist.length > 0) {
            console.log("invest artist already exists");
            await prisma.investArtist.update({
                where: {
                    id: investArtist[0].id
                },
                data: {
                    investedCoins: investArtist[0].investedCoins as number + coins,
                    coins: investArtist[0].coins as number + coins
                }
            })
        } else {
            await prisma.investArtist.create({
                data: {
                    investedCoins: coins,
                    coins: coins,
                    artistId: artist_id,
                    userId: user_id,
                }
            })
        }

        await prisma.investArtistLog.create({
            data: {
                coins: coins,
                artistId: artist_id,
                userId: user_id,
                operation_id: 1,
                operation: "buy"

            }
        })

        // update trade user

        const trade_user = await prisma.tradeUser.findFirst({
            where: {
                userId: user_id
            }
        })

        const coins_invested = trade_user?.coins_invested as number;

        const new_coins = (trade_user?.coins as number) - coins;

        const new_coins_invested = coins_invested + coins;

        await prisma.tradeUser.update({
            where: {
                userId: user_id
            },
            data: {
                coins: new_coins,
                coins_invested: new_coins_invested
            }

        })

        revalidatePath("/trade");

    }
}


export async function sellHandler(data: any) {
    const prisma = new PrismaClient();
    const artist_spotify_id = data?.get("artist_id");
    const coins = parseInt(data?.get("coins"));
    const user_id = (data?.get("user_id"));

    if (artist_spotify_id !== null && coins !== null && user_id !== null && !isNaN(coins)) {
        console.log(" Sell all data is there");

        const user = await prisma.user.findFirst({
            where: {
                id: user_id
            }
        })

        if (user === null) {
            console.log("user not found");
            return;
        }

        const artist = await prisma.artist.findFirst({
            where: {
                spotify_id: artist_spotify_id
            }
        })

        if (artist === null) {
            console.log("artist not found");
            return;
        }

        const artist_id = artist?.id;

        const investArtist = await prisma.investArtist.findMany({
            where: {
                artistId: artist_id,
                userId: user_id
            }
        })

        if (investArtist.length === 0) {
            console.log("invest artist not found");
            return;
        }

        const coinsNow = investArtist[0].coins as number;

        if (coinsNow < coins) {
            console.log("Your Max is " + coinsNow + " you want to sell " + coins);
            return;
        }


        if (investArtist.length > 0) {
            console.log("invest artist already exists");
            if (investArtist[0].coins === coins) {
                await prisma.investArtist.delete({
                    where: {
                        id: investArtist[0].id
                    }
                })
            } else {

                await prisma.investArtist.update({
                    where: {
                        id: investArtist[0].id
                    },
                    data: {
                        coins: investArtist[0].coins as number - coins,
                        investedCoins: investArtist[0].investedCoins as number - coins
                    }
                })
            }

            await prisma.investArtistLog.create({
                data: {
                    coins: coins,
                    artistId: artist_id,
                    userId: user_id,
                    operation_id: 2,
                    operation: "sell"

                }
            })

            // update trade user

            const trade_user = await prisma.tradeUser.findFirst({
                where: {
                    userId: user_id
                }
            })

            const coins_invested = trade_user?.coins_invested as number;

            const new_coins = (trade_user?.coins as number) + coins;

            const new_coins_invested = coins_invested - coins;

            await prisma.tradeUser.update({
                where: {
                    userId: user_id
                },
                data: {
                    coins: new_coins,
                    coins_invested: new_coins_invested
                }

            })

        } else {
            return;
        }


        revalidatePath("/trade");

    }


}

