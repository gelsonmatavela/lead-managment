export function formatToMoney(value: string | number){
    return value.toLocaleString('en-US',{
        minimumFractionDigits: 2,
    })
}