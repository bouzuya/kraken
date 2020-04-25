import * as kuromoji from "kuromoji";
import * as path from "path";

export interface UnknownEntry {
  word_id: number;
  word_type: string;
  word_position: number;
  surface_form: string;
  pos: string;
  pos_detail_1: string;
  pos_detail_2: string;
  pos_detail_3: string;
  conjugated_type: string;
  conjugated_form: string;
  basic_form: string;
}

export interface Entry {
  word_id: number;
  word_type: string;
  word_position: number;
  surface_form: string;
  pos: string;
  pos_detail_1: string;
  pos_detail_2: string;
  pos_detail_3: string;
  conjugated_type: string;
  conjugated_form: string;
  basic_form: string;
  reading: string;
  pronunciation: string;
}

export type Token = Entry | UnknownEntry;

export interface Tokenizer {
  tokenize: (text: string) => Token[];
}

const tokenizer = (): Promise<Tokenizer> => {
  return new Promise((resolve, reject) => {
    const dicPath = path.join(require.resolve("kuromoji"), "../../dict/");
    kuromoji
      .builder({ dicPath })
      .build((error: Error, tokenizer: Tokenizer): void => {
        if (typeof error === "undefined" || error === null) {
          resolve(tokenizer);
        } else {
          reject(error);
        }
      });
  });
};

export { tokenizer };
