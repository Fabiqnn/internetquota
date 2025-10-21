import React, { useRef } from "react";
import Link  from "next/link";
import { ChevronLeft, ChevronRight, RadioTower } from "lucide-react";

interface CardData {
  id: number;
  title: string;
  price: string;
  image?: string;
}

interface HorizontalCardScrollProps {
  items: CardData[];
}

const HorizontalCardScroll: React.FC<HorizontalCardScrollProps> = ({ items }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8; // geser 80% lebar viewport
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full py-6">
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full shadow p-2 z-10 hover:bg-white transition"
        aria-label="Scroll left"
      >
        <ChevronLeft size={20} />
      </button>

      <div
        ref={scrollRef}  
        className="flex overflow-x-auto gap-4 scroll-smooth scrollbar-hide px-10"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="min-w-[250px] bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 flex-shrink-0"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.price}</p>
              </div>
              <div className="flex items-center justify-center">
                <RadioTower className="" color="#2b7efe"/>
              </div>
            </div>
            <Link key={item.id} href={`/dashboard/pulsa/${item.id}`} className="block p-2 text-white text-center bg-blue-500 hover:bg-blue-600 w-full rounded mt-5 cursor-pointer">Beli Paket</Link>
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full shadow p-2 z-10 hover:bg-white transition"
        aria-label="Scroll right"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default HorizontalCardScroll;
