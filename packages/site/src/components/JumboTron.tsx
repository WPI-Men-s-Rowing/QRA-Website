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
    <div className="lg:h-screen w-screen aspect-[16/9] relative">
      <div className="lg:h-screen w-screen aspect-[16/9] overflow-hidden absolute">
        <Image
          fill
          placeholder="blur"
          src={props.picture}
          alt="QRA"
          className="object-cover brightness-50"
        />
      </div>
      <div className="h-fit absolute inset-x-0 bottom-10 text-center">
        <div className="lg:text-5xl text-2xl font-bold text-background">
          {props.title}
        </div>
        <div className="lg:text-3xl text-base font-normal text-background-subtext">
          {props.subtitle}
        </div>
      </div>
    </div>
  );
}

export default JumboTron;
