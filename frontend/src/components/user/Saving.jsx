import React from "react";

const Saving = () => {
  const firstRowItems = [
    {
      heading: "Bridal",
      offerText: "",
      description: "Elegant Wedding Collection",
      imgSrc: "/images/Home/featured-1.webp",
      textcolor: "black",
    },
    {
      heading: "Knitwear's",
      offerText: "Essential wardrobe staples",
      description: "",
      imgSrc: "/images/Home/featured-5.jpg",
      textcolor: "black",
    },
    {
      heading: "L'Étoile",
      offerText: "",
      description: "fw 24",
      imgSrc: "/images/Home/featured-3.webp",
      textcolor: "white",
    },
  ];

  const secondRowItems = [
    {
      heading: "Topman X Hartley",
      offerText: "",
      description: "Classic tailoring meets streetwear",
      textcolor: "white",
      imgSrc: "/images/Home/featured-4.webp",
    },
    {
      heading: "Oversized T-Shirts",
      offerText: "",
      description: "Street Style Icon",
      imgSrc: "/images/Home/featured-2.jpg",
      textcolor: "black",
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-center my-4">
        <div className="flex items-center w-full max-w-6xl">
          <div className="flex-grow border-t-2 border-gray-300"></div>
          <h1
            style={{ fontFamily: "'Cambay', sans-serif" }}
            className="text-2xl text-gray-600 mx-6 whitespace-nowrap"
          >
            Elegant Attires
          </h1>
          <div className="flex-grow border-t-2 border-gray-300"></div>
        </div>
      </div>

      {/* First row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
        {firstRowItems.map((item, index) => (
          <div
            key={index}
            className="group  rounded-lg p-4 w-full md:w-[400px] h-[600px] relative"
          >
            <img
              src={item.imgSrc}
              alt={item.heading}
              className="rounded-lg w-full h-full object-cover transition duration-300 ease-in-out group-hover:brightness-75"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
              <h2
                className={`text-5xl font-bold text-${item.textcolor}`}
                style={{ fontFamily: "'EB Garamond', serif" }}
              >
                {item.heading}
              </h2>
              <p className={`text-lg text-${item.textcolor}`}>
                {item.description}
              </p>
              <p className={`mt-2 font-bold text-${item.textcolor}`}>
                {item.offerText}
              </p>
              <button
                className={`mt-4 cursor-pointer px-4 py-2 border text-${item.textcolor} border-white rounded-full hover:bg-gray-500/20`}
              >
                SHOP NOW
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {secondRowItems.map((item, index) => (
          <div
            key={index}
            className="group  rounded-lg flex justify-center relative"
          >
            {/* Fixed-height container so images appear uniform */}
            <div className="w-full h-[600px]">
              <img
                src={item.imgSrc}
                alt={item.heading}
                className="rounded-lg w-full h-full object-cover transition duration-300 ease-in-out group-hover:brightness-75"
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
              <h2
                className={`text-5xl font-bold text-${item.textcolor}`}
                style={{ fontFamily: "'EB Garamond', serif" }}
              >
                {item.heading}
              </h2>
              <p className={`mt-2 text-${item.textcolor}`}>
                {item.description}
              </p>
              <p className={`mt-2 font-bold text-${item.textcolor}`}>
                {item.offerText}
              </p>
              <button
                className={`mt-4 cursor-pointer px-4 py-2 border text-${item.textcolor} border-gray-800 rounded-full hover:bg-gray-500/20`}
              >
                SHOP NOW
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Saving;
