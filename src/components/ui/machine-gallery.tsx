"use client";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function MachineGallery({ images, title }: { images: string[]; title: string }) {
    const [active, setActive] = useState(0);
    if (!images || images.length === 0) {
        return (
            <div className="relative w-full aspect-[4/3] md:h-[480px] bg-gray-100 flex items-center justify-center rounded-t-2xl text-gray-400">
                Sin imágenes
            </div>
        );
    }
    const prev = () => setActive(i => (i === 0 ? images.length - 1 : i - 1));
    const next = () => setActive(i => (i === images.length - 1 ? 0 : i + 1));
    return (
        <div>
            <div className="relative w-full aspect-[4/3] md:h-[480px] bg-gray-100 overflow-hidden rounded-t-2xl group">
                <Image src={images[active]} alt={`${title} foto ${active + 1}`} fill className="object-cover transition-opacity duration-200" priority={active === 0} />
                {images.length > 1 && (
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full">{active + 1} / {images.length}</div>
                )}
                {images.length > 1 && (<>
                    <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all" aria-label="Anterior"><ChevronLeft className="w-6 h-6" /></button>
                    <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all" aria-label="Siguiente"><ChevronRight className="w-6 h-6" /></button>
                </>)}
                {images.length > 1 && images.length <= 8 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, idx) => (
                            <button key={idx} onClick={() => setActive(idx)} className={`w-2 h-2 rounded-full transition-all ${idx === active ? "bg-white scale-125" : "bg-white/50"}`} />
                        ))}
                    </div>
                )}
            </div>
            {images.length > 1 && (
                <div className="flex gap-2 px-4 pt-3 overflow-x-auto pb-1">
                    {images.map((img, idx) => (
                        <button key={idx} onClick={() => setActive(idx)} className={`relative w-16 h-14 md:w-24 md:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${idx === active ? "border-brand-yellow shadow-md" : "border-gray-200 hover:border-gray-400"}`}>
                            <Image src={img} alt={`Foto ${idx + 1}`} fill className="object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
