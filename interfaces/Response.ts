import type ISeason from "./season/season"

export interface IBaseResponse{
    success:boolean
    message:string
}

export interface ICreateSeasonResponse extends IBaseResponse{
    season:ISeason | null
}