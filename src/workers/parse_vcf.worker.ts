import { VCFParserService } from '@/services/VCFParserService';

onmessage = async (e: MessageEvent<File>) => {
  const vcfParser = new VCFParserService(e.data);
  const result = await vcfParser.parse();
  postMessage(result);
};
