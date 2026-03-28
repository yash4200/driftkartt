<div style={styles.card}>
  <h3 style={styles.cardTitle}>Payment Method</h3>
  <div style={styles.payOption}>
    <div style={{ display: 'flex', gap: '10px' }}><span>📱</span> UPI (GPay/PhonePe)</div>
    <div style={styles.radioInactive}></div>
  </div>
  <div style={styles.payOption}>
    <div style={{ display: 'flex', gap: '10px' }}><span>💳</span> Credit/Debit Card</div>
    <div style={styles.radioInactive}></div>
  </div>
  <div style={styles.payOptionActive}>
    <div style={{ display: 'flex', gap: '10px' }}><span>💵</span> Cash on Delivery</div>
    <div style={styles.radioActive}></div>
  </div>
</div>
const styles = {
  payOption: { display: 'flex', justifyContent: 'space-between', padding: '15px', border: '1px solid #eee', borderRadius: '12px', marginBottom: '10px', opacity: 0.6 },
  payOptionActive: { display: 'flex', justifyContent: 'space-between', padding: '15px', border: '2px solid #E23744', backgroundColor: '#fff5f6', borderRadius: '12px', marginBottom: '10px' },
  radioActive: { width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#E23744', border: '3px solid #fff', boxShadow: '0 0 0 1px #E23744' },
  radioInactive: { width: '16px', height: '16px', borderRadius: '50%', border: '1px solid #ddd' }
}