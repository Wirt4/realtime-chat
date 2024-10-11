 const layoutClassNames = {
    div:{
        className: 'w-full flex h-screen',
        div:[{
            className: 'flex h-full w-full max-w-xs frow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'
        },
            {
                className: 'text-xs font-semibold leading-6 text-gray-400',
                nav:{
                    className: 'text-xs font-semibold leading-6 text-gray-400',
                    ul:{
                        className:'flex flex-1 flex-col gap-y-7',
                        ul:{
                            className:'-mx-2 mt-2 space-y-1'
                        }
                    }
                }
            }],
        Link:{
            className: 'flex h-16 shrink-0 items-center',
            Icon:{
                className: 'h-20 w-auto text-indigo-600'
            }
        }
    }
}

export default layoutClassNames;