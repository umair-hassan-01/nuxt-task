/*
valid:boolean
instancePath
message
 */

interface IValidationError{
    instancePath:string
    message:string
}

export default interface IValid{
    valid:boolean
    errors:IValidationError[]
}