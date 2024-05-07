"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import HomeLink from "@/app/homelink";

export default function GuildBrowseMember() {
    const [user, setUser] = useState<any>(null);
    const [mainGuild, setGuild] = useState<any>(null);
    const [guilds, setGuilds] = useState<any[]>([]);

    useEffect(() => {
        axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user",
            withCredentials: true
        })
            .then(user => {
                if(user.data&&!user.data.display) {
                    location.href = "/account/create";
                    return;
                }
                setUser(user.data);
                axios({
                    method: "get",
                    url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/guild",
                    withCredentials: true
                })
                    .then(guild => {
                        setGuild(guild.data);
                    })
            })
        axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/guilds",
            withCredentials: true
        })
            .then(guilds => {
                setGuilds(guilds.data);
            })
    }, []);

    const handleSetMainGuild = (id:string) => {
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/guild",
            data: {
                id: id
            },
            withCredentials: true
        })
            .then(() => {
                location.href = "/guild/browse/member";
            });
    }

    const scoreToLevel = (score:number) => {
        return Math.floor(Math.sqrt(score/125))
    }

    return (
        <div>
            <h1>Guilds</h1>
            {mainGuild&&<div className="card">
                <Link href={"/guild/"+mainGuild.id}><p>(Main Guild) {mainGuild.display}</p></Link>
                <p className="text">Level: {scoreToLevel(mainGuild.score)}</p>
                <p className="text">Score: {mainGuild.score}</p>
                {user&&mainGuild&&mainGuild.player===user.id&&<button><Link className="primary" href="/guild/manage">Manage</Link></button>}
            </div>}
            {guilds && guilds.map((guild:any) => (
                <div key={guild.score} className="card">
                    <Link href={"/guild/"+guild.id}><p className="text">{guild.display}</p></Link>
                    <p className="text">Level: {scoreToLevel(guild.score)}</p>
                    <p className="text">Score: {guild.score}</p>
                    {user&&mainGuild&&mainGuild.player!==user.id&&<button onClick={() => handleSetMainGuild(guild.id)}><Link className="primary" href="/guild/manage">Set Main</Link></button>}
                </div>
            ))}
            {user&&(!mainGuild||mainGuild.player!==user.id)&&<Link className="button" href="/guild/create">Create Guild</Link>}
			<Link className="button" href="/guild/browse">Browse Guilds</Link>
            <HomeLink/>
        </div>
    );
}