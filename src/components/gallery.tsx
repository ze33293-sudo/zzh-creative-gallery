"use client";
import {useRef,useState} from "react";
import {Play,ImageIcon,ChevronLeft,ChevronRight,X} from "lucide-react";
import {Tabs,TabsList,TabsTrigger,TabsContent} from "@/components/ui/tabs";
import {Dialog,DialogContent,DialogTitle,DialogDescription,DialogClose} from "@/components/ui/dialog";
import {type Work,type Category,categoryNames,timeLabel} from "@/lib/types";
import {works} from "@/lib/works";

export function WorkViewer({works,index,onIndex,onClose,returnFocus}:{works:Work[];index:number|null;onIndex:(n:number)=>void;onClose:()=>void;returnFocus?:React.RefObject<HTMLElement|null>}){
 const work=index===null?null:works[index];
 return <Dialog open={!!work} onOpenChange={open=>{if(!open)onClose()}}><DialogContent className="work-viewer" showCloseButton={false} onCloseAutoFocus={e=>{if(returnFocus?.current){e.preventDefault();returnFocus.current.focus({preventScroll:true})}}} onKeyDown={e=>{if(!work||index===null||e.target instanceof HTMLVideoElement)return;if(e.key==="ArrowLeft"&&index>0)onIndex(index-1);if(e.key==="ArrowRight"&&index<works.length-1)onIndex(index+1)}}>
 {work&&<><div className="viewer-heading"><div><DialogTitle>{work.title}</DialogTitle><DialogDescription>{categoryNames[work.category]} · {work.kind==="video"?timeLabel(work.duration):"图片"}</DialogDescription></div><DialogClose className="icon-button" aria-label="关闭作品"><X/></DialogClose></div><div className="viewer-stage">{work.kind==="video"?<video key={work.id} src={work.mediaUrl} poster={work.posterUrl} controls playsInline preload="metadata" aria-label={work.title}/>:<img src={work.mediaUrl} alt={work.title}/>}</div><div className="viewer-footer"><button className="text-button" disabled={index===0} onClick={()=>onIndex(index!-1)}><ChevronLeft size={18}/>上一项</button><span>{index!+1} / {works.length}</span><button className="text-button" disabled={index===works.length-1} onClick={()=>onIndex(index!+1)}>下一项<ChevronRight size={18}/></button></div></>}
 </DialogContent></Dialog>
}
export default function Gallery(){
 const [category,setCategory]=useState("all"),[index,setIndex]=useState<number|null>(null);const trigger=useRef<HTMLElement|null>(null);
 const selected=works.filter(w=>category==="all"||w.category===category);
 const groups:Category[]=category==="all"?["ecommerce","drama"]:[category as Category];
 return <>
 <a className="skip-link" href="#works">跳至作品</a>
 <header className="gallery-header"><a href={import.meta.env.BASE_URL} className="wordmark"><span className="brand-mark" aria-hidden="true">Z</span><span>张泽华 <i>·</i> 作品集</span></a></header>
 <main className="gallery-main"><h1 className="sr-only">张泽华的作品集</h1><Tabs value={category} onValueChange={v=>{setCategory(v);setIndex(null)}}>
 <div className="gallery-toolbar"><TabsList className="category-tabs" aria-label="作品分类">{[["all","全部"],["ecommerce","电商"],["drama","漫剧"]].map(([value,label])=><TabsTrigger value={value} key={value}>{label}<span>{works.filter(w=>value==="all"||w.category===value).length}</span></TabsTrigger>)}</TabsList><span className="collection-count">{selected.length} 件作品</span></div>
 <div id="works">{selected.length===0?<div className="empty-state">暂时没有公开作品。</div>:<TabsContent value={category}>
 {groups.map(group=>{const items=selected.filter(w=>w.category===group);return items.length>0&&<section className="work-section" key={group} aria-label={`${categoryNames[group]}作品`} data-category={group}>
 {category==="all"&&<div className="section-heading"><h2>{categoryNames[group]}作品</h2><span>{items.length} 件</span></div>}
 <div className="work-wall">{items.map((work,i)=><article className="work-card" key={work.id}><button className="work-open" onClick={e=>{trigger.current=e.currentTarget;setIndex(selected.findIndex(w=>w.id===work.id))}} aria-label={`${work.kind==="video"?"播放":"查看"} ${work.title}`}>
 <div className="work-visual"><img src={work.posterUrl} width={work.width} height={work.height} alt={work.title} loading={group==="ecommerce"&&i<4?"eager":"lazy"}/><span className="media-type">{work.kind==="video"?<><Play size={13} fill="currentColor"/>{timeLabel(work.duration)}</>:<ImageIcon size={16}/>}</span><span className="open-cue" aria-hidden="true">{work.kind==="video"?<Play size={25}/>:<ImageIcon size={25}/>}</span></div>
 <div className="work-caption"><h3>{work.title}</h3><span>{categoryNames[work.category]}</span></div></button></article>)}</div></section>})}
 </TabsContent>}</div></Tabs></main>
 <footer className="gallery-footer"><span>张泽华 · 作品集</span><a href="#works" onClick={e=>{e.preventDefault();window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})}}>回到顶部</a></footer>
 <WorkViewer works={selected} index={index} onIndex={setIndex} onClose={()=>setIndex(null)} returnFocus={trigger}/></>
}
