
const MAX_LENGTH = 5;

export const generate = () => {
   let ans = "";

   const subset = "1234567890qwertyuioplkjhgfdsazxcvbnm";
   for(let i=0;i < 5;i++) {
    ans += subset[Math.floor(Math.random() * subset.length)]
   }
   
   return ans;
}