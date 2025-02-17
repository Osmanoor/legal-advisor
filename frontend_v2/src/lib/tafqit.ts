// Types for tafqit options
interface TafqitOptions {
    Feminine?: 'on';
    Comma?: 'on';
    SplitHund?: 'on';
    Miah?: 'on';
    Billions?: 'on';
    TextToFollow?: 'on';
    AG?: 'on';
    Subject?: [string, string, string, string];
    Legal?: 'on';
  }
  
  // Constants
  const TableScales = ["","ألف","مليون","مليار","ترليون","كوادرليون","كوينتليون","سكستليون"];
  const TableScalesP = ["","آلاف","ملايين","مليارات"];
  const TableMale = ["","واحد","اثنان","ثلاثة","أربعة","خمسة","ستة","سبعة","ثمانية","تسعة","عشرة"];
  const TableFemale = ["","واحدة","اثنتان","ثلاث","أربع","خمس","ست","سبع","ثمان","تسع","عشر"];
  
  export function tafqit(NumIn: number | string = 0, options: TafqitOptions = {}): string {
    const {
      Feminine,
      Comma,
      SplitHund,
      Miah,
      Billions,
      TextToFollow,
      AG,
      Subject,
      Legal
    } = options;
  
    if (NumIn == 0) return "صفر";
  
    // Initialize variables before use
    let Triplet = 0;
    let Scale = "";
    let ScalePos = 0;
    let ScalePlural = "";
    let TableUnits = [...TableMale];
    let Table11_19 = [...TableMale];
    let NumberInWords = "";
    let IsLastEffTriplet = false;
    let Num_99 = 0;
  
    const ON = "on";
    const IsAG = (AG === ON);
    const SpWa = " و";
    const TanweenLetter = "ًا";
    const Ahad = "أحد";
    const Ehda = "إحدى";
    
    const Taa = IsAG ? "تي" : "تا";
    const Taan = IsAG ? "تين" : "تان";
    const Aa = IsAG ? "ي" : "ا";
    const Aan = IsAG ? "ين" : "ان";
    const Ethna = IsAG ? "اثني" : "اثنا";
    const Ethnata = IsAG ? "اثنتي" : "اثنتا";
    const Ethnan = IsAG ? "اثنين" : "اثنان";
    const Ethnatan = IsAG ? "اثنتين" : "اثنتان";
    const Woon = IsAG ? "ين" : "ون";
    
    const IsSubject = Array.isArray(Subject) && Subject.length === 4;
  
    let isTextToFollow = TextToFollow === ON;
    if (IsSubject) isTextToFollow = true;
  
    let numStr = String(NumIn);
    numStr = String(numStr).replace(/[٠-٩]/g, d => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
    const selectedMiah = (Miah === ON) ? "مئة" : "مائة";
  
    // Initialize TableUnits and Table11_19
    Table11_19[0] = TableFemale[10];
    Table11_19[1] = Ahad;
    Table11_19[2] = Ethna;
    TableUnits[2] = Ethnan;
  
    numStr = "0".repeat(numStr.length * 2 % 3) + numStr;
    const NumLen = numStr.length;
  
    function oneTripletToWords(): string {
      Num_99 = Triplet % 100;
      const Num_100 = Math.floor(Triplet/100);
      const Num_Unit = Num_99 % 10;
      const Num_Tens = Math.floor(Num_99/10);
      let Word_100 = "";
      let Word_99 = "";
  
      if (Feminine === ON && !Scale) {
        TableUnits = [...TableFemale];
        Table11_19 = [...TableFemale];
        Table11_19[0] = TableMale[10];
        Table11_19[1] = Ehda;
        Table11_19[2] = Ethnata;
        TableUnits[2] = Ethnatan;
        if (Num_99 > 19) TableUnits[1] = Ehda;
      }
  
      if (Num_100) {
        if (Num_100 > 2) Word_100 = TableFemale[Num_100] + (SplitHund === ON ? " " : "") + selectedMiah;
        else if (Num_100 === 1) Word_100 = selectedMiah;
        else Word_100 = selectedMiah.slice(0,-1) + (Scale && !Num_99 || isTextToFollow ? Taa : Taan);
      }
  
      if (Num_99 > 19) {
        Word_99 = TableUnits[Num_Unit] + (Num_Unit ? SpWa : "") +
                  (Num_Tens === 2 ? "عشر" : TableFemale[Num_Tens]) + Woon;
      } else if (Num_99 > 10) {
        Word_99 = Table11_19[Num_99-10] + " " + Table11_19[0];
      } else if (Num_99 > 2 || !Num_99 || !IsSubject) {
        Word_99 = TableUnits[Num_99];
      }
  
      let Words999 = Word_100 + (Num_100 && Num_99 ? SpWa : "") + Word_99;
  
      if (Scale) {
        const legalTxt = (Legal === ON && Num_99 < 3) ? " " + Scale : "";
        const Word_100Wa = (Num_100 ? Word_100 + legalTxt + SpWa : "") + Scale;
        
        if (Num_99 > 2) {
          Words999 += " " + (Num_99 > 10 
            ? Scale + (IsLastEffTriplet && isTextToFollow ? "" : TanweenLetter)
            : ScalePlural);
        } else {
          if (!Num_99) Words999 += " " + Scale;
          else if (Num_99 === 1) Words999 = Word_100Wa;
          else Words999 = Word_100Wa + (IsLastEffTriplet && isTextToFollow ? Aa : Aan);
        }
      }
      
      return Words999;
    }
  
    for (let digits = NumLen; digits > 0; digits -= 3) {
      Triplet = +numStr.substr(NumLen - digits, 3);
      IsLastEffTriplet = !+numStr.substr(NumLen - digits + 3);
      
      if (Triplet) {
        ScalePos = Math.floor(digits/3) - 1;
        Scale = TableScales[ScalePos];
        ScalePlural = (ScalePos < 4 ? TableScalesP[ScalePos] : TableScales[ScalePos] + "ات");
        
        if (Billions && ScalePos === 3) {
          Scale = "بليون";
          ScalePlural = "بلايين";
        }
        
        NumberInWords += oneTripletToWords();
        if (!IsLastEffTriplet) NumberInWords += (Comma === ON ? "،" : "") + SpWa;
      }
    }
  
    let SubjectName = "";
    if (IsSubject) {
      const space = !IsLastEffTriplet ? "" : " ";
      Triplet = +(String(Triplet)).slice(-2);
      SubjectName = space + Subject[0];
      
      if (Triplet > 10) SubjectName = space + Subject[3];
      else if (Triplet > 2) SubjectName = space + Subject[2];
      else if (Triplet > 0) SubjectName = Subject[Triplet-1] + " " + TableUnits[Num_99];
    }
  
    return NumberInWords + SubjectName;
  }