import { API_BASE_URL } from "@/lib/api/auth";
import { parseJSONResponse } from "@/lib/api/fetcher";

export interface SellerAuction {
  id: number;
  title: string;
  description?: string;
  bannerUrl?: string;
  startsAt?: string;
  endsAt?: string;
  startTime?: string;
  endTime?: string;
  status: string;
  itemCount?: number;
  items?: number;
  totalBids?: number;
  participants?: number;
  winner?: string;
  profit?: number;
  [key: string]: unknown;
}

export interface AuctionItem {
  id: number;
  name: string;
  variety?: string;
  size?: string | number;
  imageUrl?: string;
  openBid?: number;
  increment?: number;
  buyNow?: number;
  status?: string;
  media?: { id?: number; url?: string }[];
  [key: string]: unknown;
}

export interface AuctionDetail extends SellerAuction {
  items?: AuctionItemOnAuction[];
}

export interface AvailableAuctionItem extends AuctionItem {
  sizeValue?: number;
}

interface FetchSellerAuctionsOptions {
  signal?: AbortSignal;
}

export async function fetchSellerAuctions(
  accessToken: string,
  options?: FetchSellerAuctionsOptions
): Promise<SellerAuction[]> {
  const response = await fetch(`${API_BASE_URL}/auction/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    signal: options?.signal,
  });

  return parseJSONResponse<SellerAuction[]>(response);
}

export interface CreateAuctionPayload {
  title: string;
  description: string;
  bannerUrl: string;
  startTime?: string | null;
  endTime?: string | null;
}

function buildAuthHeaders(accessToken?: string) {
  if (!accessToken) {
    return {};
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export async function createSellerAuction(
  payload: CreateAuctionPayload,
  accessToken: string
): Promise<{ id?: number }> {
  const { startTime, endTime, ...rest } = payload;
  const normalizedPayload = {
    ...rest,
    ...(startTime ? { startTime } : {}),
    ...(endTime ? { endTime } : {}),
  };

  const response = await fetch(`${API_BASE_URL}/auction`, {
    method: "POST",
    headers: {
      ...buildAuthHeaders(accessToken),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(normalizedPayload),
  });

  return parseJSONResponse<{ id?: number }>(response);
}

export async function fetchAuctionDetail(
  auctionId: string | number,
  accessToken?: string,
  options?: FetchSellerAuctionsOptions
): Promise<AuctionDetail> {
  const response = await fetch(`${API_BASE_URL}/auction/${auctionId}`, {
    headers: {
      ...buildAuthHeaders(accessToken),
      "Content-Type": "application/json",
    },
    cache: "no-store",
    signal: options?.signal,
  });

  return parseJSONResponse<AuctionDetail>(response);
}

export interface AuctionItemOnAuction {
  id: number;
  itemId: number;
  status: string;
  openBid: string | number;
  increment: string | number;
  buyNow?: string | number | null;
  item?: AuctionItem;
}

export async function fetchAuctionItems(
  auctionId: string | number,
  accessToken: string,
  options?: FetchSellerAuctionsOptions
): Promise<AuctionItemOnAuction[]> {
  const response = await fetch(`${API_BASE_URL}/auction/${auctionId}/items`, {
    headers: {
      ...buildAuthHeaders(accessToken),
      "Content-Type": "application/json",
    },
    cache: "no-store",
    signal: options?.signal,
  });

  return parseJSONResponse<AuctionItemOnAuction[]>(response);
}

export async function fetchAvailableAuctionItems(
  auctionId: string | number,
  accessToken: string,
  options?: FetchSellerAuctionsOptions
): Promise<AvailableAuctionItem[]> {
  const response = await fetch(
    `${API_BASE_URL}/auction/${auctionId}/available-items`,
    {
      headers: {
        ...buildAuthHeaders(accessToken),
        "Content-Type": "application/json",
      },
      cache: "no-store",
      signal: options?.signal,
    }
  );

  return parseJSONResponse<AvailableAuctionItem[]>(response);
}

export interface AddAuctionItemsPayload {
  items: Array<{
    itemId: number;
    openBid: number;
    increment: number;
    buyNow?: number | null;
  }>;
}

export async function addItemsToAuction(
  auctionId: string | number,
  payload: AddAuctionItemsPayload,
  accessToken: string
): Promise<{ success?: boolean }> {
  const response = await fetch(`${API_BASE_URL}/auction/${auctionId}/items`, {
    method: "POST",
    headers: {
      ...buildAuthHeaders(accessToken),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJSONResponse<{ success?: boolean }>(response);
}

export interface LaunchAuctionPayload {
  startTime: string;
  endTime: string;
}

export async function launchAuction(
  auctionId: string | number,
  payload: LaunchAuctionPayload,
  accessToken: string
): Promise<{ status?: string }> {
  const response = await fetch(`${API_BASE_URL}/auction/${auctionId}/launch`, {
    method: "POST",
    headers: {
      ...buildAuthHeaders(accessToken),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJSONResponse<{ status?: string }>(response);
}

export interface UpdateAuctionPayload {
  title?: string;
  description?: string;
  bannerUrl?: string;
}

export async function updateAuction(
  auctionId: string | number,
  payload: UpdateAuctionPayload,
  accessToken: string
): Promise<SellerAuction> {
  const response = await fetch(`${API_BASE_URL}/auction/${auctionId}`, {
    method: "PATCH",
    headers: {
      ...buildAuthHeaders(accessToken),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJSONResponse<SellerAuction>(response);
}

export interface PublicAuction extends SellerAuction {
  user?: {
    id?: number;
    name?: string;
    avatar?: string;
  };
}

export async function fetchLiveAuctions(): Promise<PublicAuction[]> {
  const response = await fetch(`${API_BASE_URL}/auction/live`);
  return parseJSONResponse<PublicAuction[]>(response);
}
