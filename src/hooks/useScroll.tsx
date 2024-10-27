import React from "react"

const useScroll = ({
    total,
    setPage,
    quantity,
}: {
    total: any
    setPage: any
    quantity: any
}) => {
    React.useEffect(() => {
        function handleScroll() {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight
            ) {
                console.log("end")
                if (total > quantity) {
                    setPage((prevPage: number) => prevPage + 1)
                }
            }
        }

        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [total, quantity])
}

export default useScroll
