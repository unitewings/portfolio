import { Metadata } from 'next';
import { getSiteSettings } from "@/lib/data";
import SubmitClient from "./SubmitClient";

export const metadata: Metadata = {
    title: "Submit Content"
};

export default async function SubmitContentPage() {
    const settings = await getSiteSettings();
    const categories = ["Blog"];

    return <SubmitClient categories={categories} />;
}
