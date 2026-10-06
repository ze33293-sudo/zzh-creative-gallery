export type Category = "ecommerce" | "drama";
export type Work = {id:string;title:string;category:Category;kind:"video"|"image";width:number;height:number;duration:number;status:"draft"|"published"|"hidden";sortOrder:number;originalName?:string;size?:number;mediaUrl:string;posterUrl:string;createdAt?:number};
export const categoryNames={ecommerce:"电商",drama:"漫剧"};
export const timeLabel=(s:number)=>`${Math.floor(s/60).toString().padStart(2,"0")}:${Math.floor(s%60).toString().padStart(2,"0")}`;
