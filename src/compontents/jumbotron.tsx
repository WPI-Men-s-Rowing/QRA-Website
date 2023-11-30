interface JumboTronProps {
    title: string;
    subtitle: string;
    picture: string;
}

function JumboTron(props: JumboTronProps) {
    return (
        <div className="h-full static">
            <img className="w-full h-screen object-cover brightness-50" src={props.picture}
                 alt="QRA"/>
            <div className="h-fit absolute inset-x-0 bottom-10 text-center text-white">
                <div className="text-5xl font-bold text-white">{props.title}</div>
                <div className="text-3xl font-normal text-white">{props.subtitle}</div>
            </div>
        </div>
    );
}

export default JumboTron;