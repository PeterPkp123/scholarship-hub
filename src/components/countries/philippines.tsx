import Image from "next/image";

const Country: React.FC = () => {
  return (
    <>
      <p className="text-lg text-gray-500">
        Welcome to the Philippines, a tropical paradise located in Southeast
        Asia. The Philippines is made up of over 7,600 islands, with a
        population of over 113 million people, making it one of the most
        populous countries in the world. The country is known for its stunning
        beaches, rich culture, and delicious cuisine.
      </p>

      <br />

      <Image
        className="absoulte"
        alt=""
        src="/pictures/philippines1.jpg"
        width={1000}
        height={600}
      />
    </>
  );
};

export default Country;
