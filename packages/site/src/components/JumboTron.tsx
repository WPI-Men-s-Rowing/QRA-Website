import { StaticImageData } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

/**
 * Props to use in the creation of the JumboTron
 */
interface JumboTronProps {
  /**
   * The title to display on the JumboTron
   */
  title: string;
  /**
   * The subtitle to display on the JumboTron
   */
  subtitle: string;
  /**
   * Absolute URL pathing to the image to display on the JumboTron
   */
  picture: StaticImageData;
}

/**
 * Creates a jumbo tron that will fill the height of its parent container
 * @param props thd props to use in creating the jumbotron
 * @returns
 */
function JumboTron(props: JumboTronProps) {
  return (
    <div className="h-full static">
      <div className="w-full h-screen object-cover brightness-50">
        <Image fill src={props.picture} alt="QRA" />
      </div>
      <div className="h-fit absolute inset-x-0 bottom-10 text-center text-white">
        <div className="text-5xl font-bold text-white">{props.title}</div>
        <div className="text-3xl font-normal text-white">{props.subtitle}</div>
      </div>
    </div>
  );
}

export default JumboTron;
