import React from 'react'

export default function FunctionalLink({innerText, callBack}) {
    return (
        <span onClick={() => callBack()} className="p-10 content-center hover:text-pink-900 cursor-pointer block font-bold text-sm">
            {innerText}
        </span>
    )
}
