import Image from "next/image";

const Country: React.FC = () => {
  return (
    <>
      <p className="text-lg text-gray-500">
        Welcome to the United States of America, a country known for its vast
        landscapes, diverse cultures, and iconic landmarks. The USA is the third
        largest country in the world, located in North America and bordered by
        Canada to the north and Mexico to the south. The country is home to 50
        states, each with its own unique history, culture, and natural beauty.
      </p>

      <br />

      <Image
        className="absoulte"
        alt=""
        src="/pictures/united-states1.jpg"
        width={1000}
        height={600}
      />
    </>
  );
};

export default Country;
