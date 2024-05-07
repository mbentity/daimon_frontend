"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import HomeLink from "../../homelink";

export default function Invite() {
    const [ guild, setGuild ] = useState<string>("");
    const [ targetPlayer, setTargetPlayer ] = useState<string>("");

    const HandlePost = () => {
        axios({
            method: "post",
            url: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT+"/message",
            data: {
                guild: guild,
                targetPlayer: targetPlayer
            },
            withCredentials: true
        })
    }

    return (
        <div>
            <h1>Invite</h1>
            <input type="text" placeholder="Target Player" onChange={e => setTargetPlayer(e.target.value)} />
            <button onClick={HandlePost}>Invite</button>
            <HomeLink/>
        </div>
    );
}
