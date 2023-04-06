import Image from "next/image";

const Country: React.FC = () => {
  return (
    <>
      <p className="text-lg text-gray-500">
        Welcome to India, a land of incredible diversity and rich cultural
        heritage! India is the seventh largest country in the world by land
        area, located in South Asia and bordered by Pakistan, China, Nepal,
        Bhutan, Bangladesh, Myanmar and Afghanistan. The country is home to a
        staggering variety of landscapes, ranging from snow-capped Himalayan
        peaks in the north to sun-drenched beaches in the south, and from lush
        tropical forests to dry deserts.
      </p>

      <br />

      <Image
        className="absoulte"
        alt=""
        src="/pictures/india1.jpg"
        width={1000}
        height={600}
      />
    </>
  );
};

export default Country;
