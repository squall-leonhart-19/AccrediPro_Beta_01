import { VipUpgradeCheckout } from "@/components/funnel/VipUpgradeCheckout"

export default function VipOfferPage() {
    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="container px-4 mx-auto max-w-4xl">

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div className="w-[80%] h-full bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <p className="text-center text-xs font-bold text-gray-500 mt-2 uppercase tracking-wide">
                        Account Created... Finalizing Enrollment...
                    </p>
                </div>

                <div className="text-center mb-10 space-y-4">
                    <h1 className="text-3xl lg:text-5xl font-extrabold text-[#cd3f3e] uppercase leading-tight">
                        Wait! Your Registration is Complete...
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        ...but your free access is limited to 14 days.
                        <span className="font-bold text-gray-900 block mt-2">
                            Upgrade to VIP Status to unlock LIFETIME access & the Clinical Cheat Sheets.
                        </span>
                    </p>
                </div>

                <VipUpgradeCheckout
                    specialtySlug="functional-medicine"
                    nextPath="/dashboard"
                />

                <div className="mt-12 text-center text-sm text-gray-400 max-w-xl mx-auto">
                    <p>
                        <strong>Why are we doing this?</strong> We want to separate the serious practitioners from the hobbyists.
                        The $47 fee ensures you are committed to finishing the program and allows us to provide lifetime server access.
                    </p>
                </div>

            </div>
        </div>
    )
}
