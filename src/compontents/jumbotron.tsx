interface JumboTronProps {
    title: string;
    subtitle: string;
    picture: string;
}

function JumboTron(props: JumboTronProps) {
    return (
        <div className="h-auto static">
            <img className="w-full h-screen object-cover" src={props.picture}
                 alt="QRA"/>
            <div className="h-fit absolute inset-x-0 bottom-0 flex flex-col justify-end p-10 text-center text-white">
                <div className="text-5xl font-bold">{props.title}</div>
                <div className="text-2xl font-normal">{props.subtitle}</div>
            </div>
        </div>
    );
}

export default JumboTron;