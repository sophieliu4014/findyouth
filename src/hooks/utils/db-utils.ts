
import { supabase } from '@/integrations/supabase/client';

// Check if the events table has a cause_area column
export async function checkCauseAreaColumn(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('get_columns_for_table', { table_name: 'events' });
      
    if (error) {
      console.error("Error checking for columns:", error);
      return false;
    } else if (data && Array.isArray(data)) {
      const hasCauseArea = data.some((col: { column_name: string, data_type: string }) => 
        col.column_name === 'cause_area'
      );
      console.log("Column detection data:", data);
      console.log("Events table has cause_area column:", hasCauseArea);
      return hasCauseArea;
    }
  } catch (err) {
    console.error("Error checking for cause_area column:", err);
  }
  
  return false;
}
