import { Button } from "@/components/ui/button";


export default function Home() {
	return (
		<div>
			<h1 className="text-4xl tracking-tight font-semibold text-pink-600">Agent Daddy</h1>
		<p className="text-base">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Necessitatibus quo est alias, culpa sed odio, voluptates numquam voluptatum perferendis soluta obcaecati repudiandae odit, perspiciatis vel possimus dignissimos repellendus ratione consequuntur?</p>
		<Button variant={"secondary"} size={"xs"} className="ring-2 ring-primary">Deploy Claw Now</Button>
		</div>
	);
}
 