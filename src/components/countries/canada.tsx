import Image from "next/image";

const Country: React.FC = () => {
  return (
    <>
      <p className="text-lg text-gray-500">
        Welcome to the land of maple syrup and ice hockey, Canada! This vast and
        diverse country is located in the northern part of North America, and is
        bordered by the United States to the south and the Arctic Ocean to the
        north. The country also shares land border with Denmark since 2022.
        Canada is the second largest country in the world by land area, covering
        a total of over 9.98 million square kilometers, and is divided into ten
        provinces and three territories.
      </p>

      <br />

      <Image
        className="absoulte"
        alt=""
        src="/pictures/canada1.jpg"
        width={1000}
        height={600}
      />
    </>
  );
};

export default Country;
