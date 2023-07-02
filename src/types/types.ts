export interface TokenProps {
    token: string;
  }

export interface RuasData {
    id: number;
    unit_id: number;
    ruas: string;
    long: number;
    km_awal: string;
    km_akhir: string;
    status: boolean;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
    unit: {
      id: string;
      unit: string;
    };
    coordinate: {
      id: number;
      ruas_id: number;
      coordinates: string;
      ordering: number;
      created_by: string;
      updated_by: string;
      createdAt: string;
      updatedAt: string;
    }[];
    pin_coordinate: {
      id: number;
      ruas_id: number;
      coordinate: string;
      ordering: number;
      created_by: string;
      updated_by: string;
      createdAt: string;
      updatedAt: string;
    }[];
    index: number;
  }

export  interface RuasResponse {
    current_page: string;
    data: RuasData[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: string;
    prev_page_url: string | null;
    to: string;
    total: number;
  }