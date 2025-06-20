import { FaEnvelope, FaMapMarkedAlt, FaPhone } from "react-icons/fa";

const Contact = () =>{
    return(
        <div
            className="flex flex-col items-center min-h-screen pt-[90px] pb-12 bg-cover bg-center"
            style={{backgroundImage: "url('https://images.pexels.com/photos/3184460/pexels-photo-3184460.jpeg?_gl=1*1c4o2n1*_ga*MTk0Nzc3NjkxMi4xNzUwMjYyNjg3*_ga_8JE65Q40S6*czE3NTAyNjI2ODYkbzEkZzEkdDE3NTAyNjI5MTYkajU5JGwwJGgw')"}}
        >
            <div className="bg-white bg-opacity-90 shadow-2xl rounded-lg p-8 w-full max-w-lg">
                <h1 className="text-4xl font-bold text-center mb-6">
                    Contact Us
                </h1>
                <p className="text-gray-600 text-center mb-4">
                    We would love to hear from you! Please fill out the form below or contact us directly
                </p>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-50700">
                            Name
                        </label>
                        <input 
                        text = "text"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus: ring-blue-500"
                        />
                        
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-50700">
                            Email
                        </label>
                        <input 
                        text = "email"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus: ring-blue-500"
                        />
                        
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-50700">
                            Message
                        </label>
                        <textarea
                        text = "4"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus: ring-blue-500"
                        />
                        
                    </div>
                    <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                        Send Message
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <h2 className="text-lg font-semibold">Contact Information</h2>
                    <div className="flex flex-col items-center space-y-2 mt-4">
                        <div className="flex item-center">
                            <FaPhone className="text-blue-500 mr-2"/>
                            <span className="text-gray-600">+91 98976 54265</span>
                        </div>
                        <div className="flex item-center">
                            <FaEnvelope className="text-blue-500 mr-2"/>
                            <span className="text-gray-600">contactus@ourstore.com</span>
                        </div>
                        <div className="flex item-center">
                            <FaMapMarkedAlt className="text-blue-500 mr-2"/>
                            <span className="text-gray-600">22/98, road.no 5, Hyderabad</span>
                        </div>
                    </div>
                </div>
            </div>
        
        </div>
    )
}

export default Contact;
