import { forwardRef, useState } from "react";
import { SearchableSelect } from "./SearchableSelect";

interface PhoneInputProps {
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    name?: string;
    id?: string;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
}

const countryCodes = [
    { code: "+1", country: "United States/Canada", flag: "🇺🇸" },
    { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+81", country: "Japan", flag: "🇯🇵" },
    { code: "+86", country: "China", flag: "🇨🇳" },
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+49", country: "Germany", flag: "🇩🇪" },
    { code: "+39", country: "Italy", flag: "🇮🇹" },
    { code: "+34", country: "Spain", flag: "🇪🇸" },
    { code: "+7", country: "Russia", flag: "🇷🇺" },
    { code: "+55", country: "Brazil", flag: "🇧🇷" },
    { code: "+27", country: "South Africa", flag: "🇿🇦" },
    { code: "+52", country: "Mexico", flag: "🇲🇽" },
    { code: "+82", country: "South Korea", flag: "🇰🇷" },
    { code: "+65", country: "Singapore", flag: "🇸🇬" },
    { code: "+60", country: "Malaysia", flag: "🇲🇾" },
    { code: "+62", country: "Indonesia", flag: "🇮🇩" },
    { code: "+63", country: "Philippines", flag: "🇵🇭" },
    { code: "+66", country: "Thailand", flag: "🇹🇭" },
    { code: "+84", country: "Vietnam", flag: "🇻🇳" },
    { code: "+971", country: "UAE", flag: "🇦🇪" },
    { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+20", country: "Egypt", flag: "🇪🇬" },
    { code: "+234", country: "Nigeria", flag: "🇳🇬" },
    { code: "+254", country: "Kenya", flag: "🇰🇪" },
    { code: "+92", country: "Pakistan", flag: "🇵🇰" },
    { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
    { code: "+64", country: "New Zealand", flag: "🇳🇿" },
    { code: "+353", country: "Ireland", flag: "🇮🇪" },
    { code: "+31", country: "Netherlands", flag: "🇳🇱" },
    { code: "+32", country: "Belgium", flag: "🇧🇪" },
    { code: "+41", country: "Switzerland", flag: "🇨🇭" },
    { code: "+43", country: "Austria", flag: "🇦🇹" },
    { code: "+45", country: "Denmark", flag: "🇩🇰" },
    { code: "+46", country: "Sweden", flag: "🇸🇪" },
    { code: "+47", country: "Norway", flag: "🇳🇴" },
    { code: "+358", country: "Finland", flag: "🇫🇮" },
    { code: "+351", country: "Portugal", flag: "🇵🇹" },
    { code: "+30", country: "Greece", flag: "🇬🇷" },
    { code: "+48", country: "Poland", flag: "🇵🇱" },
    { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
    { code: "+36", country: "Hungary", flag: "🇭🇺" },
    { code: "+40", country: "Romania", flag: "🇷🇴" },
    { code: "+90", country: "Turkey", flag: "🇹🇷" },
    { code: "+972", country: "Israel", flag: "🇮🇱" },
    { code: "+212", country: "Morocco", flag: "🇲🇦" },
    { code: "+213", country: "Algeria", flag: "🇩🇿" },
    { code: "+216", country: "Tunisia", flag: "🇹🇳" },
];

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
    ({ value = "", onChange, onBlur, name, id, disabled, className, placeholder = "Phone number" }, ref) => {
        // Parse existing value into country code and number
        const parseValue = (val: string) => {
            if (!val) return { countryCode: "+94", phoneNumber: "" }; // Default to Sri Lanka

            // Find matching country code from the start of the string
            const matchingCode = countryCodes.find(cc => val.startsWith(cc.code));
            if (matchingCode) {
                return {
                    countryCode: matchingCode.code,
                    phoneNumber: val.substring(matchingCode.code.length).trim()
                };
            }

            // If no match, default to +94 and use entire value as number
            return { countryCode: "+94", phoneNumber: val };
        };

        const { countryCode: initialCode, phoneNumber: initialNumber } = parseValue(value);
        const [countryCode, setCountryCode] = useState(initialCode);
        const [phoneNumber, setPhoneNumber] = useState(initialNumber);

        const handleCodeChange = (newCode: string) => {
            setCountryCode(newCode);
            const fullNumber = phoneNumber ? `${newCode}${phoneNumber}` : newCode;
            onChange?.(fullNumber);
        };

        const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newNumber = e.target.value.replace(/[^0-9]/g, ''); // Only numbers
            setPhoneNumber(newNumber);
            const fullNumber = newNumber ? `${countryCode}${newNumber}` : countryCode;
            onChange?.(fullNumber);
        };

        return (
            <div className="flex gap-2">
                <div className="w-24">
                    <SearchableSelect
                        options={countryCodes.map((cc) => ({
                            label: `${cc.flag} ${cc.code}`,
                            value: cc.code
                        }))}
                        value={countryCode}
                        onChange={handleCodeChange}
                        disabled={disabled}
                        className="h-[46px]"
                    />
                </div>
                <input
                    ref={ref}
                    id={id}
                    name={name}
                    type="tel"
                    value={phoneNumber}
                    onChange={handleNumberChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={
                        className ||
                        "flex-1 w-30 px-4 md:px-2 py-3 text-base border border-purple-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                    }
                />
            </div>
        );
    }
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
