"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import HomeLink from "../homelink";

export default function Inbox() {
    const [ user, setUser ] = useState<any>(null);
    const [ messages, setMessages ] = useState<any[]>([]);
    const [ guild, setGuild ] = useState<any>(null);

    useEffect(() => {
        axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user",
            withCredentials: true
        })
            .then(user => {
                if(!user.data) {
                    location.href = "/account/login";
                    return;
                }
                if(user.data&&!user.data.display) {
                    location.href = "/account/create";
                    return;
                }
                setUser(user.data);
            });
        Promise.all([
            axios({
                method: "get",
                url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/messages",
                withCredentials: true
            }),
            axios({
                method: "get",
                url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/guild/messages",
                withCredentials: true
            })
        ])
            .then(([messages, guildMessages]) => {
                setMessages(messages.data.concat(guildMessages.data));
            })
        axios ({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/guild",
            withCredentials: true
        })
            .then(guild => {
                setGuild(guild.data);
            })
    }, []);

    const handleDelete = (message: any) => {
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/message/delete",
            withCredentials: true,
            data: {
                type: message.type,
                guild: message.guild,
                player: message.player,
            }
        })
            .then(() => {
                setMessages(messages.filter(m => m!==message));
            });
    }

    const handleJoin = (message: any) => {
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/guilds",
            withCredentials: true,
            data: {
                id: message.guild
            }
        })
    }

    const handleWelcome = (message: any) => {
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/user/guild/member",
            withCredentials: true,
            data: {
                id: message.player
            }
        })
    }

    // type 0: guild invitation
    // type 1: guild application
    // type 0: the user is lfg, the guild invites the user and the user accepts
    // type 1: the user applies to the guild and the guild accepts

    return (
        <div>
            <h1>Inbox</h1>
            {messages.map((message, index) => {
                return (
                    <div key={index} className="card">
                        {message.type===0&&<><p>Guild Invitation</p>
                        <p className="text">The player {message.player_display} has been invited to join the guild {message.guild_display}.</p>
                        </>}
                        {message.type===1&&<><p>Guild Application</p>
                        <p className="text">The player {message.player_display} has applied to join the guild {message.guild_display}.</p>
                        </>}
                        {message.type===0&&user&&message.player===user.id&&<button onClick={() => handleJoin(message)}>Accept Invite</button>}
                        {message.type===1&&guild&&message.guild===guild.id&&<button onClick={() => handleWelcome(message)}>Accept Application</button>}
                        <button onClick={() => handleDelete(message)}>
                            {message.type===0&&guild&&message.guild===guild.id&&"Revoke Invite"}
                            {message.type===1&&guild&&message.guild===guild.id&&"Reject Application"}
                            {message.type===0&&user&&message.player===user.id&&"Refuse Invite"}
                            {message.type===1&&user&&message.player===user.id&&"Cancel Application"}
                        </button>
                    </div>
                );
            })}
            <HomeLink/>
        </div>
    );
}