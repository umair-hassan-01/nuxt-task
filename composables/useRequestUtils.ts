export default function useRequestUtils(){
    async function getMessage(url:string):Promise<any>{
        try{
            const response = await fetch(url);
            const data = await response.json();
    
            return data;
        }catch(error:any){
            return "error";
        }
    }

    return {
        getMessage
    }
}