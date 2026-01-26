export default function R2TestPage() {
    const testUrl = "https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/avatars/zombie-cmk8w1ys10002xym9uoo1tzyd.png";
    const customDomainUrl = "https://assets.accredipro.academy/avatars/zombie-cmk8w1ys10002xym9uoo1tzyd.png";

    return (
        <div className="p-10 space-y-8">
            <h1 className="text-2xl font-bold">R2 Image Test</h1>

            {/* Test 1: Original R2 URL */}
            <div className="border p-4 rounded-lg">
                <h2 className="font-semibold mb-2 text-lg">Test 1: Original R2 URL (pub-bc38...)</h2>
                <div className="flex gap-4 items-start">
                    <div>
                        <p className="text-sm font-medium mb-1">img tag:</p>
                        <img
                            src={testUrl}
                            alt="Test avatar original"
                            width={150}
                            height={150}
                            className="rounded-lg bg-gray-100"
                        />
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 font-mono break-all">{testUrl}</p>
            </div>

            {/* Test 2: Custom Domain URL */}
            <div className="border p-4 rounded-lg bg-green-50/50 border-green-200">
                <h2 className="font-semibold mb-2 text-lg text-green-800">Test 2: Custom Domain (assets.accredipro.academy)</h2>
                <div className="flex gap-4 items-start">
                    <div>
                        <p className="text-sm font-medium mb-1">img tag:</p>
                        <img
                            src={customDomainUrl}
                            alt="Test avatar custom"
                            width={150}
                            height={150}
                            className="rounded-lg bg-gray-100"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-medium mb-1">background image:</p>
                        <div
                            className="w-[150px] h-[150px] rounded-lg bg-cover bg-center bg-gray-100"
                            style={{ backgroundImage: `url(${customDomainUrl})` }}
                        />
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 font-mono break-all">{customDomainUrl}</p>
            </div>
        </div>
    );
}
