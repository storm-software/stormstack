import { ArticleJsonLd, LogoJsonLd, SocialProfileJsonLd } from "next-seo";
import Logo from "../../../../../assets/box-logo-gradient.svg";
import {
  ARTICLE_JSON_LD_DEFAULT,
  LOGO_JSON_LD_DEFAULT,
  PROFILE_JSON_LD_DEFAULT,
} from "../../next-seo.config";

export default function Page() {
  return (
    <div>
      <ArticleJsonLd {...ARTICLE_JSON_LD_DEFAULT} useAppDir={true} />
      <SocialProfileJsonLd {...PROFILE_JSON_LD_DEFAULT} useAppDir={true} />
      <LogoJsonLd {...LOGO_JSON_LD_DEFAULT} useAppDir={true} />

      <div className="flex flex-col gap-60">
        <section className="flex justify-center">
          <div className="relative h-[600px] w-2/3">
            <div className="absolute bottom-0 left-0">
              <div className="flex flex-col gap-3">
                <h1 className="w-fit font-barrio text-7xl leading-none text-primary">
                  <span className="bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_6px] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_40%]">
                    Patrick
                  </span>
                </h1>
                <h1 className="w-fit font-barrio text-7xl leading-none text-primary">
                  <span className="bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_6px] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_40%]">
                    Sullivan
                  </span>
                </h1>
                <h1 className="w-fit font-barrio text-7xl leading-none text-primary">
                  <span className="bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_6px] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_40%]">
                    Development
                  </span>
                </h1>
              </div>
            </div>

            <div className="absolute top-0 right-0">
              <Logo alt="box-logo" />
            </div>
          </div>
        </section>

        <section className="flex justify-center">
          <div className="relative h-[600px] w-2/3">
            <div className="absolute bottom-0 left-0">
              <div className="flex flex-col">
                <h1 className="font-barrio text-7xl text-primary">Patrick</h1>
                <h1 className="font-barrio text-7xl text-primary">Sullivan</h1>
                <h1 className="font-barrio text-7xl text-primary">
                  Development
                </h1>
              </div>
            </div>

            <div className="absolute top-0 right-0">
              <Logo alt="box-logo" />
            </div>
          </div>
        </section>
      </div>

      <div className="space-y-10 text-white"></div>
    </div>
  );
}
