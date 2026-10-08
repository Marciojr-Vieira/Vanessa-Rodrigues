import { renewSession } from '@/lib/auth'
import { apiError,assertSameOrigin } from '@/lib/security'
export async function POST(request:Request){
 try{assertSameOrigin(request);await renewSession();return Response.json({success:true})}catch(e){return apiError(e)}
}
