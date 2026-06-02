import { convertDayMonthToMonthDay } from "@/utils/dates.utils";
import type { ClaimService } from "../claims/claim.service";
import type { ConversationStateService } from "../conversation/conversation.service";
import type { ConversationState } from "../conversation/conversation.types";
import { ClaimStep } from "../conversation/conversation.types";
import { MediaService } from "@/integrations/whatssap/media.handler";
import type { ILocation } from "@/integrations/whatssap/whatssap.types";
import type { CloudinaryService } from "@/integrations/cloudinary/cloudinary.service";
import type { StepResult } from "./orchestrator.types";

export class ConversationStepHandler {
  constructor(
    private claimService: ClaimService,
    private sessionService: ConversationStateService,
    private cloudMediaService: CloudinaryService,
  ) {}

  async handleStep(
    state: ConversationState,
    userMessage: any,
    images?: any,
    location?: ILocation,
  ): Promise<StepResult> {
    userMessage = userMessage?.text?.body ?? "";

    switch (state.currentStep) {
      case ClaimStep.START:
        return this.handleStart(state, userMessage);
      case ClaimStep.AWAITING_POLICY_NUMBER:
        return this.handlePolicyNumber(state, userMessage);
      case ClaimStep.AWAITING_DATE:
        return this.handleDate(state, userMessage);
      case ClaimStep.AWAITING_TIME:
        return this.handleTime(state, userMessage);
      case ClaimStep.AWAITING_LOCATION:
        return this.handleLocation(state, userMessage, location);
      case ClaimStep.AWAITING_DESCRIPTION:
        return this.handleDescription(state, userMessage);
      case ClaimStep.AWAITING_BLAME:
        return this.handleBlame(state, userMessage);
      case ClaimStep.AWAITING_OTHER_PERSON_DETAILS:
        return this.handleOtherPersonDetails(state, userMessage);
      case ClaimStep.AWAITING_DAMAGE_DESCRIPTION:
        return this.handleDamageDescription(state, userMessage);
      case ClaimStep.AWAITING_VEHICLE_LOCATION:
        return this.handleVehicleLocation(state, userMessage);
      case ClaimStep.AWAITING_REPAIRER:
        return this.handleRepairer(state, userMessage);
      case ClaimStep.AWAITING_REPAIR_COST:
        return this.handleRepairCost(state, userMessage);
      case ClaimStep.AWAITING_OTHER_VEHICLE_REG:
        return this.handleOtherVehicleReg(state, userMessage);
      case ClaimStep.AWAITING_OTHER_VEHICLE_MAKE:
        return this.handleOtherVehicleMake(state, userMessage);
      case ClaimStep.AWAITING_OTHER_VEHICLE_OWNER:
        return this.handleOtherVehicleOwner(state, userMessage);
      case ClaimStep.AWAITING_OTHER_VEHICLE_INSURER:
        return this.handleOtherVehicleInsurer(state, userMessage);
      case ClaimStep.AWAITING_POLICE_WITNESSED:
        return this.handlePoliceWitnessed(state, userMessage);
      case ClaimStep.AWAITING_POLICE_PARTICULARS:
        return this.handlePoliceParticulars(state, userMessage);
      case ClaimStep.AWAITING_POLICE_OFFICER:
        return this.handlePoliceOfficer(state, userMessage);
      case ClaimStep.AWAITING_POLICE_STATION:
        return this.handlePoliceStation(state, userMessage);
      case ClaimStep.AWAITING_WITNESS1:
        return this.handleWitness1(state, userMessage);
      case ClaimStep.AWAITING_WITNESS2:
        return this.handleWitness2(state, userMessage);
      case ClaimStep.AWAITING_IMAGES:
        return this.handleImages(state, userMessage, images);
      case ClaimStep.COMPLETE:
        return this.handleComplete(state);
      case ClaimStep.AWAITING_REPAIR_INVOICE:
        return this.handleRepairInvoice(state, userMessage, images);
      case ClaimStep.AWAITING_INJURED_DETAILS:
        return this.handleInjuredDetails(state, userMessage);
      case ClaimStep.AWAITING_INJURED_PERSON_NAME:
        return this.handleInjuredPersonName(state, userMessage);
      case ClaimStep.AWAITING_INJURED_PERSON_PHONE:
        return this.handleInjuredPersonPhone(state, userMessage);
      case ClaimStep.AWAITING_INJURED_PERSON_SEVERITY:
        return this.handleInjuredPersonSeverity(state, userMessage);
      case ClaimStep.AWAITING_MORE_INJURED:
        return this.handleMoreInjured(state, userMessage);
      case ClaimStep.AWAITING_DOCTOR_REPORT:
        return this.handleDoctorReport(state, userMessage, images);
      case ClaimStep.AWAITING_POLICE_REPORT:
        return this.handlePoliceReport(state, userMessage, images);
      case ClaimStep.AWAITING_GHANA_CARD:
        return this.handleGhanaCard(state, userMessage, images);

      default:
        return {
          newState: { ...state, currentStep: ClaimStep.START },
          response: "Let's start over. Please send *hi* or *start*.",
        };
    }
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private next(
    state: ConversationState,
    nextStep: ClaimStep,
    data: Partial<ConversationState["data"]>,
    response: string,
    userMessage: string,
    buttons?: { title: string; id: string }[],
  ): StepResult {
    return {
      newState: {
        ...state,
        currentStep: nextStep,
        data: { ...state.data, ...data },
        lastMessage: userMessage,
        updatedAt: new Date(),
      },
      response,
      buttons,
    };
  }

  private invalid(
    state: ConversationState,
    response: string,
    buttons?: { title: string; id: string }[],
  ): StepResult {
    return { newState: state, response, buttons };
  }

  // Vehicle reg: letters, spaces, hyphens — Eg: GR 123-24
  private isValidVehicleReg(value: string): boolean {
    return /^[A-Za-z]{2,3}[\s-]?\d{3,4}[-]?\d{0,2}$/i.test(value.trim());
  }

  // Time: HH:MM (24hr or 12hr with optional AM/PM)
  private isValidTime(value: string): boolean {
    return /^([01]?\d|2[0-3]):[0-5]\d(\s?(AM|PM|am|pm))?$/.test(value.trim());
  }

  // Date: DD/MM/YYYY
  private isValidDate(value: string): boolean {
    if (!/^(\d{2})\/(\d{2})\/(\d{4})$/.test(value)) return false;
    const [day, month, year] = value.split("/").map(Number);
    const date = new Date(year!, month! - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month! - 1 &&
      date.getDate() === day &&
      date <= new Date() // can't be in the future
    );
  }

  private async handleStart(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const msg = userMessage.toLowerCase().trim();

    // Button "🚗 File a Claim" sends back id: "start"
    if (msg === "start") {
      return this.next(
        state,
        ClaimStep.AWAITING_POLICY_NUMBER,
        {},
        "Let's begin filing your claim.\n\nPlease enter your *policy number*\n_Eg: POL-121211_",
        userMessage,
      );
    }

    // Button "❓ Ask Question" sends back id: "question"
    if (msg === "question") {
      return {
        newState: state,
        response:
          "Please type your question and our support team will assist you shortly. 🙏",
      };
    }

    // Any greeting or anything else — show the welcome buttons
    return {
      newState: { ...state, currentStep: ClaimStep.START },
      response: "👋 Welcome to *DAICA Claims*!\n\nHow can we help you today?",
      buttons: [
        { title: "🚗 File a Claim", id: "start" },
        { title: "❓ Ask Question", id: "question" },
      ],
    };
  }

  private async handlePolicyNumber(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const cleaned = userMessage.trim();
    if (cleaned.length < 5) {
      return this.invalid(
        state,
        "⚠️ Policy number is too short. Please provide a valid policy number\n_Eg: POL-121211_",
      );
    }
    if (!/^[A-Za-z0-9-]+$/.test(cleaned)) {
      return this.invalid(
        state,
        "⚠️ Policy number should only contain letters, numbers and hyphens\n_Eg: POL-121211_",
      );
    }
    return this.next(
      state,
      ClaimStep.AWAITING_DATE,
      { policyNumber: cleaned.toUpperCase() },
      "When did the accident happen?\n\nPlease provide the date in *DD/MM/YYYY* format\n_Eg: 20/05/2025_",
      userMessage,
    );
  }

  private async handleDate(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    if (!this.isValidDate(userMessage.trim())) {
      return this.invalid(
        state,
        "⚠️ Invalid date. Please use *DD/MM/YYYY* format and make sure the date is not in the future\n_Eg: 20/05/2025_",
      );
    }
    return this.next(
      state,
      ClaimStep.AWAITING_TIME,
      { accidentDate: userMessage.trim() },
      "What *time* did the accident happen?\n_Eg: 14:30 or 2:30 PM_",
      userMessage,
    );
  }

  private async handleTime(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    if (!this.isValidTime(userMessage.trim())) {
      return this.invalid(
        state,
        "⚠️ Invalid time format. Please use *HH:MM* format\n_Eg: 14:30 or 2:30 PM_",
      );
    }

    return {
      newState: {
        ...state,
        currentStep: ClaimStep.AWAITING_LOCATION, // ← advance step
        data: { ...state.data, accidentTime: userMessage.trim() }, // ← save time
        lastMessage: userMessage,
        updatedAt: new Date(),
      },
      response:
        "📍 Please share the *location where the accident happened*.\n\nYou can share the location using the button below.",
      locationRequest: true,
    };
  }

  private async handleRepairCost(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const cost = parseFloat(userMessage.replace(/,/g, "").trim());
    if (isNaN(cost) || cost <= 0) {
      return this.invalid(
        state,
        "⚠️ Please enter a valid repair cost in GHC\n_Eg: 5000_",
      );
    }
    return this.next(
      state,
      ClaimStep.AWAITING_REPAIR_INVOICE,
      { estimatedRepairCost: cost },
      "Please upload your *vehicle repair estimate invoice*.\nType *skip* if you don't have one yet.",
      userMessage,
    );
  }

  private async handleRepairInvoice(
    state: ConversationState,
    userMessage: string,
    images?: any,
  ): Promise<StepResult> {
    if (userMessage.toLowerCase().trim() === "skip") {
      return this.next(
        state,
        ClaimStep.AWAITING_INJURED_DETAILS,
        {},
        "Were any persons injured?\n\nReply with:\n*1* - Yes\n*2* - No",
        userMessage,
        [
          { title: "✅ Yes", id: "yes" },
          { title: "❌ No", id: "no" },
        ],
      );
    }

    if (!images || images.length === 0) {
      return this.invalid(
        state,
        "⚠️ Please upload your repair invoice image or type *skip* to continue without it.",
      );
    }

    const uploaded =
      await MediaService.uploadWhatsAppImagesToCloudinary(images);
    const urls = await this.cloudMediaService.uploadImages(uploaded);
    if (!urls || urls.length === 0 || !urls[0]) {
      return this.invalid(
        state,
        "⚠️ Something went wrong uploading your Ghana card image. Please try again.",
      );
    }
    return this.next(
      state,
      ClaimStep.AWAITING_INJURED_DETAILS,
      { repairInvoiceUrl: urls[0] },
      "Were any persons injured?\n\nReply with:\n*1* - Yes\n*2* - No",
      userMessage,
      [
        { title: "✅ Yes", id: "yes" },
        { title: "❌ No", id: "no" },
      ],
    );
  }

  private async handleInjuredDetails(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const val = userMessage.trim().toLowerCase();
    if (!["yes", "no"].includes(val)) {
      return this.invalid(state, "⚠️ Please select one of the options below.", [
        { title: "✅ Yes", id: "yes" },
        { title: "❌ No", id: "no" },
      ]);
    }

    if (val === "no") {
      return this.next(
        state,
        ClaimStep.AWAITING_OTHER_VEHICLE_REG,
        {},
        "Please provide the *registration number* of the other vehicle involved.\nType *none* if not applicable.",
        userMessage,
      );
    }

    return this.next(
      state,
      ClaimStep.AWAITING_INJURED_PERSON_NAME,
      { injuredPersonDetails: [], currentInjuredPerson: {} },
      "Please provide the *full name* of the injured person:",
      userMessage,
    );
  }

  private async handleInjuredPersonName(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const cleaned = userMessage.trim();
    if (cleaned.length < 2) {
      return this.invalid(
        state,
        "⚠️ Please provide the injured person's full name.",
      );
    }
    return this.next(
      state,
      ClaimStep.AWAITING_INJURED_PERSON_PHONE,
      {
        currentInjuredPerson: {
          ...state.data.currentInjuredPerson,
          name: cleaned,
        },
      },
      "Please provide their *phone number*:",
      userMessage,
    );
  }

  private async handleInjuredPersonPhone(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const cleaned = userMessage.trim();
    if (!/^\d{10,}$/.test(cleaned.replace(/\s/g, ""))) {
      return this.invalid(
        state,
        "⚠️ Please provide a valid phone number\n_Eg: 0241234455_",
      );
    }
    return this.next(
      state,
      ClaimStep.AWAITING_INJURED_PERSON_SEVERITY,
      {
        currentInjuredPerson: {
          ...state.data.currentInjuredPerson,
          phoneNumber: cleaned,
        },
      },
      "What is the *severity of their injuries*?\n\nReply with:\n*1* - Minor\n*2* - Moderate\n*3* - Severe",
      userMessage,
      [
        { title: "🟡 Minor", id: "minor" },
        { title: "🟠 Moderate", id: "moderate" },
        { title: "🔴 Severe", id: "severe" },
      ],
    );
  }

  private async handleInjuredPersonSeverity(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const val = userMessage.trim().toLowerCase();
    const severityMap: Record<string, string> = {
      minor: "Minor",
      moderate: "Moderate",
      severe: "Severe",
    };

    if (!severityMap[val]) {
      return this.invalid(state, "⚠️ Please select the severity level.", [
        { title: "🟡 Minor", id: "minor" },
        { title: "🟠 Moderate", id: "moderate" },
        { title: "🔴 Severe", id: "severe" },
      ]);
    }

    const completedPerson = {
      name: state.data.currentInjuredPerson?.name ?? "",
      phoneNumber: state.data.currentInjuredPerson?.phoneNumber ?? "",
      severity: severityMap[val]!,
    };

    const updatedList = [
      ...(state.data.injuredPersonDetails ?? []),
      completedPerson,
    ];

    if (!updatedList || updatedList.length === 0) {
      return this.invalid(
        state,
        "⚠️ Something went wrong saving the injured person's details. Please try again.",
      );
    }

    return this.next(
      state,
      ClaimStep.AWAITING_MORE_INJURED,
      { injuredPersonDetails: updatedList, currentInjuredPerson: {} },
      `✅ Injured person added.\n\nAre there *more injured persons* to add?`,
      userMessage,
      [
        { title: "➕ Add Another", id: "yes" },
        { title: "✅ Done", id: "no" },
      ],
    );
  }

  private async handleMoreInjured(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const val = userMessage.trim().toLowerCase();

    if (val === "yes") {
      return this.next(
        state,
        ClaimStep.AWAITING_INJURED_PERSON_NAME,
        { currentInjuredPerson: {} },
        "Please provide the *full name* of the next injured person:",
        userMessage,
      );
    }

    // Done adding injured persons — ask for doctor's report
    return this.next(
      state,
      ClaimStep.AWAITING_DOCTOR_REPORT,
      {},
      "Is there a *doctor's report* for the injured person(s)?\n\nPlease upload it if available, or type *skip* to continue.",
      userMessage,
    );
  }

  private async handleDoctorReport(
    state: ConversationState,
    userMessage: string,
    images?: any,
  ): Promise<StepResult> {
    if (userMessage.toLowerCase().trim() === "skip") {
      return this.next(
        state,
        ClaimStep.AWAITING_OTHER_VEHICLE_REG,
        {},
        "Please provide the *registration number* of the other vehicle involved.\nType *none* if not applicable.",
        userMessage,
      );
    }

    if (!images || images.length === 0) {
      return this.invalid(
        state,
        "⚠️ Please upload the doctor's report image or type *skip* to continue without it.",
      );
    }

    const uploaded =
      await MediaService.uploadWhatsAppImagesToCloudinary(images);
    const urls = await this.cloudMediaService.uploadImages(uploaded);
    if (!urls || urls.length === 0 || !urls[0]) {
      return this.invalid(
        state,
        "⚠️ Something went wrong uploading your Ghana card image. Please try again.",
      );
    }
    return this.next(
      state,
      ClaimStep.AWAITING_OTHER_VEHICLE_REG,
      { doctorReportUrl: urls[0] },
      "Please provide the *registration number* of the other vehicle involved.\nType *none* if not applicable.",
      userMessage,
    );
  }

  private async handlePoliceStation(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const cleaned = userMessage.trim();
    if (cleaned.length === 0) {
      return this.invalid(
        state,
        "⚠️ Please provide the police station name or type *none*.",
      );
    }
    return this.next(
      state,
      ClaimStep.AWAITING_POLICE_REPORT,
      { policeStation: cleaned },
      "Please upload your *police report* document.\nType *skip* if you don't have it yet.",
      userMessage,
    );
  }

  private async handlePoliceReport(
    state: ConversationState,
    userMessage: string,
    images?: any,
  ): Promise<StepResult> {
    if (userMessage.toLowerCase().trim() === "skip") {
      return this.next(
        state,
        ClaimStep.AWAITING_WITNESS1,
        {},
        "Please provide the name and contact of *Witness 1*.\nType *none* if there are no witnesses.",
        userMessage,
      );
    }

    if (!images || images.length === 0) {
      return this.invalid(
        state,
        "⚠️ Please upload your police report image or type *skip* to continue without it.",
      );
    }

    const uploaded =
      await MediaService.uploadWhatsAppImagesToCloudinary(images);
    const urls = await this.cloudMediaService.uploadImages(uploaded);
    if (!urls || urls.length === 0 || !urls[0]) {
      return this.invalid(
        state,
        "⚠️ Something went wrong uploading your Ghana card image. Please try again.",
      );
    }
    return this.next(
      state,
      ClaimStep.AWAITING_WITNESS1,
      { policeReportUrl: urls[0] },
      "Please provide the name and contact of *Witness 1*.\nType *none* if there are no witnesses.",
      userMessage,
    );
  }

  private async handleGhanaCard(
    state: ConversationState,
    userMessage: string,
    images?: any,
  ): Promise<StepResult> {
    if (userMessage.toLowerCase().trim() === "skip") {
      return this.next(
        state,
        ClaimStep.AWAITING_IMAGES,
        {},
        "Almost done! 📸\n\nPlease send *photos of the vehicle damage*.\nYou can send multiple images.",
        userMessage,
      );
    }

    if (!images || images.length === 0) {
      return this.invalid(
        state,
        "⚠️ Please upload your Ghana card image or type *skip* to continue without it.",
      );
    }

    const uploaded =
      await MediaService.uploadWhatsAppImagesToCloudinary(images);
    const urls = await this.cloudMediaService.uploadImages(uploaded);

    if (!urls || urls.length === 0 || !urls[0]) {
      return this.invalid(
        state,
        "⚠️ Something went wrong uploading your Ghana card image. Please try again.",
      );
    }

    return this.next(
      state,
      ClaimStep.AWAITING_IMAGES,
      { ghanaCardUrl: urls[0] },
      "Almost done! 📸\n\nPlease send *photos of the vehicle damage*.\nYou can send multiple images.",
      userMessage,
    );
  }

  private async handleWitness2(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const cleaned = userMessage.trim();
    if (cleaned.length === 0) {
      return this.invalid(
        state,
        "⚠️ Please provide witness details or type *none*.",
      );
    }
    return this.next(
      state,
      ClaimStep.AWAITING_GHANA_CARD,
      { witness2: cleaned },
      "Please upload a photo of your *Ghana Card* for identity verification.\nType *skip* if not available.",
      userMessage,
    );
  }

  private async handleLocation(
    state: ConversationState,
    userMessage: string,
    location?: ILocation,
  ): Promise<StepResult> {
    // User hasn't shared location pin yet — send the location request button
    if (!location) {
      return {
        newState: state,
        response:
          "📍 Please share the *location where the accident happened*.\n\nYou can share the location using the button below.",
        locationRequest: true, // ← orchestrator will call sendLocationRequest
      };
    }

    const locationText =
      location.address ||
      location.name ||
      `${location.latitude}, ${location.longitude}`;

    return this.next(
      state,
      ClaimStep.AWAITING_DESCRIPTION,
      {
        location: locationText,
        locationCoords: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      },
      " Please provide a more detailed description of how the accident happened.",
      userMessage,
    );
  }

  private async handleDescription(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const cleaned = userMessage.trim();
    if (cleaned.length < 10) {
      return this.invalid(
        state,
        "⚠️ Please provide a more detailed description of how the accident happened.",
      );
    }
    return this.next(
      state,
      ClaimStep.AWAITING_BLAME,
      { accidentDescription: cleaned },
      "Who do you think was to blame for the accident?",
      userMessage,
      [
        { title: "🙋 My driver/Myself", id: "1" },
        { title: "👤 Another person", id: "2" },
        { title: "⚖️ Both parties", id: "3" },
      ],
    );
  }

  private async handleBlame(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const val = userMessage.trim().toLowerCase();

    const validOptions: Record<string, { driver: boolean; other: boolean }> = {
      "1": { driver: true, other: false },
      "2": { driver: false, other: true },
      "3": { driver: true, other: true },
    };

    const match = validOptions[val];
    if (!match) {
      return this.invalid(state, "⚠️ Please select one of the options below.", [
        { title: "🙋 My driver/Myself", id: "1" },
        { title: "👤 Another person", id: "2" },
        { title: "⚖️ Both parties", id: "3" },
      ]);
    }

    if (match.other) {
      return this.next(
        state,
        ClaimStep.AWAITING_OTHER_PERSON_DETAILS,
        { driverToBlame: match.driver, otherPersonToBlame: match.other },
        "Please provide the *name, address and occupation* of the other person/institution to blame:",
        userMessage,
      );
    }

    return this.next(
      state,
      ClaimStep.AWAITING_DAMAGE_DESCRIPTION,
      { driverToBlame: match.driver, otherPersonToBlame: match.other },
      "What is the *damage to your vehicle*?\n_Eg: Front bumper dented, headlight broken_",
      userMessage,
    );
  }

  private async handleOtherPersonDetails(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const cleaned = userMessage.trim();
    if (cleaned.length < 5) {
      return this.invalid(
        state,
        "⚠️ Please provide the full name, address and occupation of the other person.",
      );
    }
    return this.next(
      state,
      ClaimStep.AWAITING_DAMAGE_DESCRIPTION,
      { otherPersonDetails: cleaned },
      "What is the *damage to your vehicle*?\n_Eg: Front bumper dented, headlight broken_",
      userMessage,
    );
  }

  private async handleDamageDescription(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const cleaned = userMessage.trim();
    if (cleaned.length < 5) {
      return this.invalid(
        state,
        "⚠️ Please describe the damage in more detail\n_Eg: Front bumper dented, headlight broken_",
      );
    }
    return this.next(
      state,
      ClaimStep.AWAITING_VEHICLE_LOCATION,
      { vehicleDamageDescription: cleaned },
      "Where can the *vehicle be seen* for inspection?\n_Eg: Tema Workshop, near Shell filling station_",
      userMessage,
    );
  }

  private async handleVehicleLocation(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const cleaned = userMessage.trim();
    if (cleaned.length < 5) {
      return this.invalid(
        state,
        "⚠️ Please provide a more specific location where the vehicle can be inspected.",
      );
    }
    return this.next(
      state,
      ClaimStep.AWAITING_REPAIRER,
      { vehicleLocation: cleaned },
      "What is the *name and location of the nearest repairer*?",
      userMessage,
    );
  }

  private async handleRepairer(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const cleaned = userMessage.trim();
    if (cleaned.length < 3) {
      return this.invalid(
        state,
        "⚠️ Please provide the name and location of the nearest repairer.",
      );
    }
    return this.next(
      state,
      ClaimStep.AWAITING_REPAIR_COST,
      { nearestRepairer: cleaned },
      "What is the *estimated cost of repairs* in GHC?\n_Eg: 5000_",
      userMessage,
    );
  }

  private async handleOtherVehicleReg(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const cleaned = userMessage.trim();
    if (cleaned.length === 0) {
      return this.invalid(
        state,
        "⚠️ Please provide the other vehicle's registration number or type *none*.",
      );
    }
    if (cleaned.toLocaleLowerCase() === "none") {
      return this.next(
        state,
        ClaimStep.AWAITING_POLICE_WITNESSED,
        { otherVehicleRegNumber: "None" },
        "Did the *Police witness* the accident?",
        userMessage,
        [
          { title: "✅ Yes", id: "1" },
          { title: "❌ No", id: "2" },
        ],
      );
    }
    if (!this.isValidVehicleReg(cleaned)) {
      return this.invalid(
        state,
        "⚠️ Invalid registration number format. Please provide a valid registration number\n_Eg: GR 123-24_",
      );
    }
    return this.next(
      state,
      ClaimStep.AWAITING_OTHER_VEHICLE_MAKE,
      { otherVehicleRegNumber: cleaned.toUpperCase() },
      "What is the *make* of the other vehicle?\n_Eg: Toyota Corolla — type *none* if not applicable_",
      userMessage,
    );
  }

  private async handleOtherVehicleMake(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const cleaned = userMessage.trim();
    if (cleaned.length === 0) {
      return this.invalid(
        state,
        "⚠️ Please provide the vehicle make or type *none*.",
      );
    }
    return this.next(
      state,
      ClaimStep.AWAITING_OTHER_VEHICLE_OWNER,
      { otherVehicleMake: cleaned },
      "Please provide the *name and phone number of the other vehicle's owner*.\nType *none* if not applicable.",
      userMessage,
    );
  }

  private async handleOtherVehicleOwner(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const cleaned = userMessage.trim();
    if (cleaned.length === 0) {
      return this.invalid(
        state,
        "⚠️ Please provide the owner details or type *none*.",
      );
    }
    return this.next(
      state,
      ClaimStep.AWAITING_OTHER_VEHICLE_INSURER,
      { otherVehicleOwnerAddress: cleaned },
      "Please provide the *name of the other vehicle's insurer*.\nType *none* if not applicable.",
      userMessage,
    );
  }

  private async handleOtherVehicleInsurer(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const cleaned = userMessage.trim();
    if (cleaned.length === 0) {
      return this.invalid(
        state,
        "⚠️ Please provide the insurer details or type *none*.",
      );
    }
    return this.next(
      state,
      ClaimStep.AWAITING_POLICE_WITNESSED,
      { otherVehicleInsurerDetails: cleaned },
      "Did the *Police witness* the accident?",
      userMessage,
      [
        { title: "✅ Yes", id: "1" },
        { title: "❌ No", id: "2" },
      ],
    );
  }

  private async handlePoliceWitnessed(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const val = userMessage.trim().toLowerCase();
    if (!["1", "2"].includes(val)) {
      return this.invalid(state, "⚠️ Please select one of the options below.", [
        { title: "✅ Yes", id: "1" },
        { title: "❌ No", id: "2" },
      ]);
    }
    const policeWitnessed = val === "✅ yes";
    return this.next(
      state,
      ClaimStep.AWAITING_POLICE_PARTICULARS,
      { policeWitnessed },
      "Did the police *take any evidence or particulars*?",
      userMessage,
      [
        { title: "✅ Yes", id: "1" },
        { title: "❌ No", id: "2" },
      ],
    );
  }

  private async handlePoliceParticulars(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const val = userMessage.trim().toLowerCase();
    if (!["1", "2"].includes(val)) {
      return this.invalid(state, "⚠️ Please select one of the options below.", [
        { title: "✅ Yes", id: "1" },
        { title: "❌ No", id: "2" },
      ]);
    }
    const policeTookParticulars = val === "✅ yes";
    return this.next(
      state,
      ClaimStep.AWAITING_POLICE_OFFICER,
      { policeTookParticulars },
      "Please provide the *name and contact of the police officer* investigating the accident.\nType *none* if not available.",
      userMessage,
    );
  }

  private async handlePoliceOfficer(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const cleaned = userMessage.trim();
    if (cleaned.length === 0) {
      return this.invalid(
        state,
        "⚠️ Please provide the officer's name and contact or type *none*.",
      );
    }
    return this.next(
      state,
      ClaimStep.AWAITING_POLICE_STATION,
      { policeOfficerName: cleaned },
      "Which *police station* is handling this case?\nType *none* if not applicable.",
      userMessage,
    );
  }

  private async handleWitness1(
    state: ConversationState,
    userMessage: string,
  ): Promise<StepResult> {
    const cleaned = userMessage.trim();
    if (cleaned.length === 0) {
      return this.invalid(
        state,
        "⚠️ Please provide witness details or type *none*.",
      );
    }
    return this.next(
      state,
      ClaimStep.AWAITING_WITNESS2,
      { witness1: cleaned },
      "Please provide the name and contact of *Witness 2*.\nType *none* if there is no second witness.",
      userMessage,
    );
  }

  private async handleImages(
    state: ConversationState,
    userMessage: string,
    images?: any,
  ): Promise<StepResult> {
    if (!images || images.length === 0) {
      return this.invalid(
        state,
        "⚠️ Please send at least one photo of the vehicle damage.",
      );
    }

    const currentImages = state.data.vehicleImages || [];
    const newImages = [...currentImages, ...images];
    const uploadedUrls =
      await MediaService.uploadWhatsAppImagesToCloudinary(newImages);
    const uploadedImg = await this.cloudMediaService.uploadImages(uploadedUrls);
    const newState: ConversationState = {
      ...state,
      data: { ...state.data, vehicleImages: uploadedImg },
      currentStep: ClaimStep.COMPLETE,
      lastMessage: userMessage,
      updatedAt: new Date(),
    };

    await this.submitClaim(newState);

    return {
      newState,
      response:
        "✅ *Claim submitted successfully!*\n\nOur support team will contact you shortly to conclude the process.\n\nThank you for choosing DAICA.",
    };
  }

  private async handleComplete(state: ConversationState): Promise<StepResult> {
    await this.sessionService.clear(state.userId);
    return {
      newState: state,
      response:
        "Your claim is already submitted. ✅\n\nType *start* to file a new claim.",
    };
  }

  // ─── Submit ─────────────────────────────────────────────────────────────────

  private async submitClaim(state: ConversationState): Promise<void> {
    const d = state.data;
    await this.claimService.createClaim({
      user_id: state.userId,
      policyNumber: d.policyNumber!,
      accidentDate: new Date(convertDayMonthToMonthDay(d.accidentDate!)),
      accidentTime: d.accidentTime!,
      location: d.location!,
      vehicleImages: d.vehicleImages ?? [],
      status: "PENDING",
      driverToBlame: d.driverToBlame,
      otherPersonToBlame: d.otherPersonToBlame,
      otherPersonDetails: d.otherPersonDetails,
      accidentDescription: d.accidentDescription,
      lightsOnAtNight: d.lightsOnAtNight,
      vehicleDamageDescription: d.vehicleDamageDescription,
      vehicleLocation: d.vehicleLocation,
      nearestRepairer: d.nearestRepairer,
      estimatedRepairCost: d.estimatedRepairCost,
      repairInvoiceUrl: d.repairInvoiceUrl,
      injuredPersonDetails: d.injuredPersonDetails ?? [],
      doctorReportUrl: d.doctorReportUrl,
      otherVehicleRegNumber: d.otherVehicleRegNumber,
      otherVehicleMake: d.otherVehicleMake,
      otherVehicleOwnerAddress: d.otherVehicleOwnerAddress,
      otherVehicleInsurerDetails: d.otherVehicleInsurerDetails,
      policeWitnessed: d.policeWitnessed,
      policeTookParticulars: d.policeTookParticulars,
      policeOfficerName: d.policeOfficerName,
      policeStation: d.policeStation,
      policeReportUrl: d.policeReportUrl,
      witness1: d.witness1,
      witness2: d.witness2,
      ghanaCardUrl: d.ghanaCardUrl,
    });

    await this.sessionService.clear(state.userId);
  }
}
