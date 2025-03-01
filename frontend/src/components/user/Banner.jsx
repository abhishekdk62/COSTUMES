import React, { useState, useEffect } from "react";

const banners = [
  {
    id: 1,
    image: "https://img.freepik.com/premium-vector/raksha-bandhan-sale-illustration-greeting-card-template-greetingposter-design_1169097-129.jpg?w=1380",
    alt: "Women Clothing Banner",
    textColor: "text-white",
    title: "Limited Offers",
    description: "Up to 80% off on latest traditionals",
  },
  {
    id: 2,
    image: "https://img.freepik.com/free-photo/portrait-handsome-confident-stylish-hipster-lambersexual-model-sexy-modern-man-dressed-elegant-black-suit-fashion-male-posing-studio-near-blue-wall_158538-24609.jpg?t=st=1740816481~exp=1740820081~hmac=ae20062019386e91507d143917e6d2627d6e84838c514aed75d77d76bcce7712&w=1380",
    alt: "Men Suits Banner",
    textColor: "text-white",
    title: "Men Suits",
    description: "Exclusive collection of men suits",
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/30063065/pexels-photo-30063065/free-photo-of-adorable-child-in-traditional-indian-attire-indoors.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    alt: "Kids Wear Banner",
    textColor: "text-white",
    title: "Kids Wear",
    description: "Trendy and comfortable kids wear",
  },
  {
    id: 4,
    image: "https://img.freepik.com/free-photo/attractive-smiling-asian-woman-holding-shopping-bags-wearing-sunglasses-cute-dress-standing-agai_1258-153611.jpg?t=st=1740816386~exp=1740819986~hmac=6244619e1662702e966d50bd2b217b788584a062214746a4cf434328225de881&w=1380",
    alt: "Women Clothing Banner",
    textColor: "text-white",
    title: "Women Clothing",
    description: "Up to 70% off on latest trends",
  },
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);

    setCurrentIndex((prev) => {
      if (direction === "right") {
        return prev === banners.length - 1 ? 0 : prev + 1;
      } else {
        return prev === 0 ? banners.length - 1 : prev - 1;
      }
    });

    setTimeout(() => {
      setIsAnimating(false);
    }, 500); // Match this duration with the CSS transition duration
  };

  useEffect(() => {
    const interval = setInterval(() => nextSlide("right"), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-60 overflow-hidden">
      <div
        className={`w-full h-full flex transition-transform duration-500 ease-in-out`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={index} className="w-full flex-shrink-0 relative">
            <img
              src={banner.image}
              alt={banner.alt}
              className="w-full h-full object-cover object-[center_20%]"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
              <h1 className={`text-5xl font-bold ${banner.textColor}`}>
                {banner.title}
              </h1>
              <p className={`text-sm ${banner.textColor}`}>
                {banner.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => nextSlide("left")}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
      >
        ❮
      </button>
      <button
        onClick={() => nextSlide("right")}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
      >
        ❯
      </button>

      {/* Indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full cursor-pointer ${
              index === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;