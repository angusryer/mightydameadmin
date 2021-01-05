import React from 'react'

export default function Button({innerText, callBack}) {
    return (
        <button type="button" className="w-full max-w-sm h-10 content-center bg-secondary hover:bg-black hover:text-white text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => callBack()}>
            {innerText}
        </button>
    )
}
