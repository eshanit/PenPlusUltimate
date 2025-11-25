const sumArray = (a: Array<any>, b: string): number => {

    if(a?.length > 0) {
        var total = a.reduce((prev, curr) =>{
            return parseFloat(prev) + parseFloat(curr[b])
        },0)
    } else {
        total = 0
    }



    return parseFloat(total.toFixed(2))
}

export default sumArray