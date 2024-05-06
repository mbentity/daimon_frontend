'use client'

import { useState, useEffect } from 'react';
import { useGlobalContext } from '../Context/store';
import axios from 'axios';
import HomeLink from '../homelink';

export default function Invite() {
    const { player } = useGlobalContext();
    const [ guild, setGuild ] = useState<string>('');
    const [ targetPlayer, setTargetPlayer ] = useState<string>('');

    useEffect(() => {
        axios({
            method: 'get',
            url: process.env.NEXT_PUBLIC_API_ENDPOINT+'player/'+player,
            withCredentials: true
        })
            .then(response => {
                console.log(response.data);
                setGuild(response.data.guild);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const HandlePost = () => {
        axios({
            method: 'post',
            url: process.env.NEXT_PUBLIC_API_ENDPOINT+'message',
            data: {
                player: player,
                guild: guild,
                targetPlayer: targetPlayer
            },
            withCredentials: true
        })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <div>
            <h1>Invite</h1>
            <input type="text" placeholder="Target Player" onChange={e => setTargetPlayer(e.target.value)} />
            <button onClick={HandlePost}>Invite</button>
            <HomeLink />
        </div>
    );
}
