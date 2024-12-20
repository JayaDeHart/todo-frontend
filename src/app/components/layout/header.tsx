import Image from "next/image";
import icon from "../../../../public/icon.svg";

const Header = () => {
  return (
    <header className="h-52 bg-darkGray flex justify-center items-center gap-4">
      <Image src={icon} alt="App Icon" width={30} height={30} />
      <h1 className="text-5xl font-extrabold">
        <span className="text-lightBlue ">Todo </span>
        <span className="text-purple">App</span>
      </h1>
    </header>
  );
};

export default Header;
