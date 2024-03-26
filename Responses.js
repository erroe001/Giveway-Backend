

export class ApiResponse {
   statusCode
   message
   data
   success
  constructor(statusCode , message , data){
      this.statusCode= statusCode
      this.message= message
      this.data= data
      this.success= true
  }
  response(res){
    return res.status(200).json({statusCode: this.statusCode ,success: this.success,  message:this.message , data:this.data })
  }
}
export class ApiErrorResponse  extends Error{
  statusCode
  message
  stack
  errors
  success
  constructor(statusCode , message , stack , errors=[]){
      super(message)
      this.statusCode = statusCode
      this.message = message
      this.errors = errors
      this.success = false
      if(stack){
          this.stack = stack
      }
      else{
          Error.captureStackTrace(this , this.constructor)
      }
  }
}




export  function globleErrorHandler(err, req, res, next) {
  console.log(err)
  if(err instanceof ApiErrorResponse){
      return res.status(err.statusCode).json({
          statusCode:err.statusCode,
        message: err.message,
          success:err.success
      });
  }
 
  return res.status(500).json({
      statusCode:500,
      message:"Something went wrong from our side ",
      success:false
  })
}