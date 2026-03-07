import Homepage from "@/components/home/Homepage";
import { Suspense } from "react";

export default function Home() {
    return (
        <section>
            <Suspense fallback={<div>Loading...</div>}>
                <Homepage />
            </Suspense>
        </section>
    );
}
