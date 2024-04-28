'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Leaderboard() {
    const [leaderboard, toggleLeaderboard] = useState("");
    const [players, setPlayers] = useState<any>(null);
    const [guilds, setGuilds] = useState<any>(null);
    const [minecraft, setMinecraft] = useState<any>(null);
    const [minecraftFactions, setMinecraftFactions] = useState<any>(null);
    const [discord, setDiscord] = useState<any>(null);

    useEffect(() => {
        // parse the query string, and set the leaderboard to the correct value
        const urlParams = new URLSearchParams(window.location.search);
        const leaderboard = urlParams.get('leaderboard');
        if (leaderboard&&(leaderboard==="players"||leaderboard==="guilds"||leaderboard==="minecraft"||leaderboard==="minecraftFactions"||leaderboard==="discord")) {
            toggleLeaderboard(leaderboard);
        }
        else {
            toggleLeaderboard("players");
        }
        refresh();
    }, []);

    const refresh = () => {
        axios({
            method: 'get',
            url: process.env.NEXT_PUBLIC_API_ENDPOINT+'leaderboards',
            withCredentials: true
        })
            .then(response => {
                console.log(response.data);
                setPlayers(response.data.players);
                setGuilds(response.data.guilds);
                setMinecraft(response.data.minecraft);
                setMinecraftFactions(response.data.minecraftFactions);
                setDiscord(response.data.discord);
            })
            .catch(error => {
                console.error(error);
            });
    }
    
    return (
        // this page will have two tabs, the player leaderboard and the guild leaderboard
        <div>
            <h1>Leaderboard</h1>
            <div className='tab'>
                <button className={leaderboard==="players"?"active":""} onClick={() => toggleLeaderboard("players")}>Players</button>
                <button className={leaderboard==="guilds"?"active":""} onClick={() => toggleLeaderboard("guilds")}>Guilds</button>
                <button className={leaderboard==="minecraft"?"active":""} onClick={() => toggleLeaderboard("minecraft")}>Minecraft</button>
                <button className={leaderboard==="minecraftFactions"?"active":""} onClick={() => toggleLeaderboard("minecraftFactions")}>Minecraft Factions</button>
                <button className={leaderboard==="discord"?"active":""} onClick={() => toggleLeaderboard("discord")}>Discord</button>
            </div>
            {leaderboard==="players"&&<>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Guild</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {players && players.sort((a: any, b: any) => b.score - a.score).map((player: any, index: number) => {
                        return (
                            <tr key={index}>
                                <td>{player.display}</td>
                                <td>{guilds.find((guild: any) => guild.id === player.guild)?.display}</td>
                                <td>{player.score}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            </>}
            {leaderboard==="guilds"&&<>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Owner</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {guilds && guilds.sort((a: any, b: any) => b.score - a.score).map((guild: any, index: number) => {
                        return (
                            <tr key={index}>
                                <td>{guild.display}</td>
                                <td>{players.find((player: any) => player.id === guild.player)?.display}</td>
                                <td>{guild.score}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            </>}
            {leaderboard==="minecraft"&&<>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Player Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {minecraft && minecraft.sort((a: any, b: any) => b.score - a.score).map((minecraft: any, index: number) => {
                        return (
                            <tr key={index}>
                                <td>{players.find((player: any) => player.id === minecraft.player)?.display}</td>
                                <td>{minecraft.realname}</td>
                                <td>{minecraft.score}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            </>}
            {leaderboard==="minecraftFactions"&&<>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Faction Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {minecraftFactions && minecraftFactions.sort((a: any, b: any) => b.score - a.score).map((minecraftFactions: any, index: number) => {
                        return (
                            <tr key={index}>
                                <td>{guilds.find((guild: any) => guild.id === minecraftFactions.guild)?.display}</td>
                                <td>{minecraftFactions.name}</td>
                                <td>{minecraftFactions.score}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            </>}
            {leaderboard==="discord"&&<>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Discord ID</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {discord && discord.sort((a: any, b: any) => b.score - a.score).map((discord: any, index: number) => {
                        return (
                            <tr key={index}>
                                <td>{players.find((player: any) => player.id === discord.player)?.display}</td>
                                <td>{discord.discord_id}</td>
                                <td>{discord.score}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            </>}
            <button className='form' onClick={refresh}>Refresh</button>
			<Link className='button' href="/">Home</Link>
        </div>
    );
}