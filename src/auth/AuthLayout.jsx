import React from "react";
import logo from "../../public/image/logo.png";
import { MdOutlineArrowBackIos } from "react-icons/md";

const AuthLayout = ({ image, imageAlt, tagline, title, subtitle, onBack, children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      {/* Illustration side */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center bg-gradient-to-b from-emerald-50 via-white to-emerald-50 px-12 py-10 border-r border-gray-100">
        <img src={logo} alt="MyNextHome" className="h-9 w-auto mb-10" />
        {image && (
          <img src={image} alt={imageAlt} className="w-full max-w-sm drop-shadow-sm" />
        )}
        {tagline && (
          <div className="text-center mt-8 max-w-sm">
            <h2 className="text-primaryBg text-2xl font-semibold">{tagline.heading}</h2>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">{tagline.subheading}</p>
          </div>
        )}
      </div>

      {/* Form side */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-[440px]">
          <div className="lg:hidden flex justify-center mb-10">
            <img src={logo} alt="MyNextHome" className="h-8 w-auto" />
          </div>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1 text-gray-400 hover:text-primaryBg text-sm mb-6 transition-colors"
            >
              <MdOutlineArrowBackIos size={12} />
              Back
            </button>
          )}

          <h1 className="text-[26px] sm:text-3xl font-semibold text-gray-800">{title}</h1>
          {subtitle && (
            <p className="text-gray-500 text-sm sm:text-[15px] mt-2 mb-8 leading-relaxed">
              {subtitle}
            </p>
          )}

          <div className={subtitle ? "" : "mt-8"}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
