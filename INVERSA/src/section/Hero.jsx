import Button from "../components/Button";


const Hero = () => {

    return (
        <section className="bg-gradient-to-br from-light-accent to-indigo-600 dark:from-dark-accent dark:to-indigo-800 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="font-logo text-5xl md:text-6xl font-bold mb-6">
                    Welcome to INVERSA
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-indigo-100 max-w-3xl mx-auto">
                    A collaborative creative writing platform where stories come to life through teamwork
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="secondary" size="lg" className="bg-white text-light-accent hover:bg-gray-100">
                        Start Writing
                    </Button>
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-light-accent">
                        Explore Projects
                    </Button>
                </div>
            </div>
        </section>
    );
};
export default Hero;