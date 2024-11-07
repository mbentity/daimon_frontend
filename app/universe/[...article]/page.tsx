"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import { HomeLink, MarkdownPage } from "@/app/commons";
import Link from "next/link";

export default function Universe ({ params }: { params: { article: string[] } }) {
    const [page, setPage] = useState<string>("");

    useEffect(() => {
        const fullPath = params.article.join("/");
        const repoName = "daimon_canon";
        const repoOwner = "masterbaseguild";
        const branchName = "main";
        const filePath = `${fullPath}.md`;

        axios({
            method: "get",
            url: `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branchName}/${filePath}`,
        })
            .then(page => {
                console.log(page.data);
                setPage(page.data);
            })
    }, []);
    
    return (
        <div>
            <h1>Universe</h1>
            <MarkdownPage page={page}/>
            <HomeLink/>
        </div>
    );
}