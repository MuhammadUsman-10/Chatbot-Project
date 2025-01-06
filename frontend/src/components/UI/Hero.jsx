
const Hero = () => {
    return (
        <div className="text-white py-10  sm:text-xl">
            <div className="container mx-auto px-4 text-center justify-center mt-12">
                <div className="inline-block">
                    <p className=" bg-yellow-600 text-black text-base md:text-lg py-2 px-4 rounded-full mb-6 inline-block animate-colorCycle font-serif">Over 3 million ready-to-work creatives!</p>
                </div>
                {/* <div className="m-10"> */}
                    <h1 className="my-10 mx-auto text-center text-black text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-serif">The world’s destination for design</h1>
                    <p className="mb-10 text-center text-black text-lg md:text-2xl ">Get inspired by the work of millions of top-rated designers & agencies around the world.</p>
                    <button className="bg-slate-900 text-white font-semibold py-5 px-7 rounded-full shadow-lg hover:bg-slate-700 transition duration-300">
                        Get Started
                    </button>
                {/* </div> */}
            </div>
        </div>
    );
};

export default Hero;